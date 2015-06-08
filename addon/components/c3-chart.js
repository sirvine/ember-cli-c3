import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['ember-c3-chart'],

  /**
   * Data object used by C3
   */
  data: {},

  /**
   * C3 JSON configuration
   */
  config: {},

  /**
   * Cached C3 chart object
   */
  _chart: undefined,

  /**
   The Chart
   */
  chart: function () {
    var cachedChart = this.get('_chart');

    if (Ember.isEqual(cachedChart, undefined)) {
      this.generateChart();
      cachedChart = this.get('_chart');
    }

    return cachedChart;
  }.property('_chart'),

  generateChart: function() {
    console.log('generateChart: ', this.get('data'));
    var cachedChart = this.get('_chart'),
      container = this.get('element'),
      data = this.get('data'),
      config, chart;

    console.log('generateChart:cachedChart: ', cachedChart);
    if (!Ember.isEqual(cachedChart, undefined)) {
      // If the element or config changes, we need to
      // destroy the existing chart before re-creating
      cachedChart.destroy();
    }

    if (!Ember.isEqual(container, undefined)) {
      config = this.get('config');
      config['data'] = data;
      config['bindto'] = container;
      console.log('c3.generate(config): ', config);
      chart = c3.generate(config);
      this.set('_chart', chart);
    }
  }.observes('config'),

  didInsertElement: function() {
    console.log('didInsertElement: ', this.get('data'));
    this._super();
    var chart = this.get('chart');
    console.log('didInsertElement:chart.load: ', this.get('data'));
    chart.load(this.get('data'));
  },

  didUpdateAttrs: function() {
    console.log('c3-chart:didUpdateAttrs');
    this.rerender();
  },

  chartShouldLoadData: function() {
    console.log('chartShouldLoadData: ', this.get('data'));
    var _this = this;
    var chart = this.get('chart');
    var currentIds = this.get('data.columns').mapBy('firstObject');
    var unloadIds = chart.data().mapBy('id').filter(function(id) {
      return currentIds.indexOf(id) < 0;
    });
    console.log('chartShouldLoadData:chart.load: ', _this.get('data.columns'));
    chart.load({columns: _this.get('data.columns'), unload: unloadIds});
  }.observes('data')

});
