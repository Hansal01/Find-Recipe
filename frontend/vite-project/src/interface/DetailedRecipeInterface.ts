export interface DetailedRecipe {
    image: string | undefined;
    title: React.ReactNode;
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    veryHealthy: boolean;
    cheap: boolean;
    veryPopular: boolean;
    sustainable: boolean;
    lowFodmap: boolean;
    weightWatcherSmartPoints: number;
    gaps: string;
    preparationMinutes: number;
    cookingMinutes: number;
    aggregateLikes: number;
    healthScore: number;
    creditsText: string;
    sourceName: string;
    pricePerServing: number;
    extendedIngredients: {
      id: number;
      aisle: string;
      image: string;
      consistency: string;
      name: string;
      nameClean: string;
      original: string;
      originalName: string;
      amount: number;
      unit: string;
      meta: string[];
      measures: {
        us: {
          amount: number;
          unitShort: string;
          unitLong: string;
        };
        metric: {
          amount: number;
          unitShort: string;
          unitLong: string;
        };
      };
    }[];
    instructions: string;
  }