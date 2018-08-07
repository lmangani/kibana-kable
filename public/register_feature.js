import { FeatureCatalogueRegistryProvider, FeatureCatalogueCategory } from 'ui/registry/feature_catalogue';

FeatureCatalogueRegistryProvider.register(() => {
  return {
    id: 'kable',
    title: 'Kable',
    description: 'Use an expression language to analyze data and visualize the results.',
    icon: '/plugins/kable/kable_feature.svg',
    path: '/app/kable',
    showOnHomePage: true,
    category: FeatureCatalogueCategory.DATA
  };
});
