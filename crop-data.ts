export interface CropData {
  name: string
  telugu: string
  image: string
  description: string
  season: string
  growthPeriod: string
  waterRequirement: string
  temperature: string
  soilType: string
  benefits: string[]
}

export const cropDatabase: Record<string, CropData> = {
  rice: {
    name: "Rice",
    telugu: "వరి",
    image: "/rice-paddy-field-golden-harvest.jpg",
    description:
      "Rice is a staple cereal grain and one of the most widely consumed foods globally. It thrives in warm, humid climates with abundant water.",
    season: "Kharif (June-November)",
    growthPeriod: "120-150 days",
    waterRequirement: "High (1500-2000mm annually)",
    temperature: "20-37°C",
    soilType: "Clay loam, silty clay loam",
    benefits: ["High carbohydrate content", "Good source of energy", "Gluten-free", "Easy to digest"],
  },
  paddy: {
    name: "Paddy",
    telugu: "ధాన్యం",
    image: "/paddy-rice-field-green-growing.jpg",
    description:
      "Paddy is unmilled rice that still retains its hull. It is the primary form of rice before processing and milling.",
    season: "Kharif & Rabi",
    growthPeriod: "90-160 days",
    waterRequirement: "Very High",
    temperature: "21-37°C",
    soilType: "Clayey soil with good water retention",
    benefits: ["Rich in nutrients", "Contains dietary fiber", "Natural antioxidants", "Supports digestive health"],
  },
  groundnut: {
    name: "Groundnut",
    telugu: "వేరుశెనగ",
    image: "/groundnut-peanut-field-harvest.jpg",
    description:
      "Groundnut, also known as peanut, is a legume crop grown mainly for its edible seeds. It is a good source of protein and oil.",
    season: "Kharif & Rabi",
    growthPeriod: "90-140 days",
    waterRequirement: "Moderate (500-750mm)",
    temperature: "20-30°C",
    soilType: "Well-drained sandy loam",
    benefits: ["High protein content", "Rich in healthy fats", "Good source of vitamins", "Heart-healthy"],
  },
  cotton: {
    name: "Cotton",
    telugu: "పత్తి",
    image: "/cotton-field-white-bolls-harvest.jpg",
    description:
      "Cotton is a soft, fluffy fiber that grows in a protective case around the seeds of cotton plants. It is the most important natural fiber in the world.",
    season: "Kharif (April-October)",
    growthPeriod: "150-180 days",
    waterRequirement: "Moderate to High (700-1300mm)",
    temperature: "21-30°C",
    soilType: "Black cotton soil, alluvial",
    benefits: ["Natural fiber", "Breathable fabric", "Biodegradable", "Hypoallergenic"],
  },
  maize: {
    name: "Maize",
    telugu: "మొక్కజొన్న",
    image: "/maize-corn-field-yellow-harvest.jpg",
    description:
      "Maize, also known as corn, is a cereal grain that is widely cultivated for food, feed, and industrial uses.",
    season: "Kharif & Rabi",
    growthPeriod: "70-120 days",
    waterRequirement: "Moderate (500-800mm)",
    temperature: "18-32°C",
    soilType: "Well-drained loamy soil",
    benefits: ["Rich in fiber", "Contains vitamins B and C", "Good for eye health", "Energy booster"],
  },
  chillies: {
    name: "Chillies",
    telugu: "మిర్చి",
    image: "/red-green-chili-peppers-field.jpg",
    description:
      "Chillies are hot peppers used as a spice and vegetable. They are rich in vitamins and add flavor to dishes.",
    season: "Kharif & Rabi",
    growthPeriod: "150-180 days",
    waterRequirement: "Moderate",
    temperature: "20-30°C",
    soilType: "Well-drained loamy soil",
    benefits: ["Rich in Vitamin C", "Boosts metabolism", "Anti-inflammatory", "Pain relief properties"],
  },
  turmeric: {
    name: "Turmeric",
    telugu: "పసుపు",
    image: "/turmeric-rhizome-golden-yellow-spice.jpg",
    description:
      "Turmeric is a flowering plant with rhizomes used as a spice. It contains curcumin, which has powerful medicinal properties.",
    season: "Kharif (June-March)",
    growthPeriod: "7-9 months",
    waterRequirement: "Moderate to High",
    temperature: "20-30°C",
    soilType: "Sandy or clay loam with good drainage",
    benefits: ["Anti-inflammatory", "Antioxidant rich", "Boosts immunity", "Improves digestion"],
  },
  sugarcane: {
    name: "Sugarcane",
    telugu: "చెరకు",
    image: "/sugarcane-field-tall-green-stalks.jpg",
    description:
      "Sugarcane is a tropical grass cultivated for its juice, which is processed into sugar and other products like jaggery and ethanol.",
    season: "Year-round",
    growthPeriod: "10-18 months",
    waterRequirement: "High (1500-2500mm)",
    temperature: "20-35°C",
    soilType: "Deep loamy soil",
    benefits: ["Instant energy source", "Hydrating", "Rich in antioxidants", "Supports liver function"],
  },
  banana: {
    name: "Banana",
    telugu: "అరటి",
    image: "/banana-plantation-green-fruit-bunches.jpg",
    description:
      "Banana is a tropical fruit crop grown for its edible fruit. It is rich in potassium and provides quick energy.",
    season: "Year-round",
    growthPeriod: "9-12 months",
    waterRequirement: "High (1200-2700mm)",
    temperature: "15-35°C",
    soilType: "Rich loamy soil with good drainage",
    benefits: ["High in potassium", "Good for heart health", "Aids digestion", "Natural energy booster"],
  },
  coconut: {
    name: "Coconut",
    telugu: "కొబ్బరి",
    image: "/coconut-palm-trees-tropical-plantation.jpg",
    description:
      "Coconut is a tropical palm tree cultivated for its edible fruit, which provides oil, water, and fiber.",
    season: "Year-round",
    growthPeriod: "5-6 years to fruiting",
    waterRequirement: "Moderate to High",
    temperature: "20-32°C",
    soilType: "Sandy loam with good drainage",
    benefits: ["Rich in healthy fats", "Hydrating coconut water", "Antibacterial properties", "Versatile uses"],
  },
  black_gram: {
    name: "Black Gram",
    telugu: "మినుములు",
    image: "/black-gram-urad-dal-legume-field.jpg",
    description:
      "Black gram, also known as urad dal, is a pulse crop that is rich in protein and used in various Indian dishes.",
    season: "Kharif & Rabi",
    growthPeriod: "90-110 days",
    waterRequirement: "Low to Moderate",
    temperature: "25-35°C",
    soilType: "Well-drained loamy soil",
    benefits: ["High protein content", "Rich in iron", "Improves digestion", "Strengthens bones"],
  },
  green_gram: {
    name: "Green Gram",
    telugu: "పెసలు",
    image: "/green-gram-mung-bean-legume-field.jpg",
    description:
      "Green gram, also known as mung bean, is a pulse crop that is easy to digest and packed with nutrients.",
    season: "Kharif & Summer",
    growthPeriod: "60-90 days",
    waterRequirement: "Low to Moderate",
    temperature: "25-35°C",
    soilType: "Well-drained loamy soil",
    benefits: ["Easy to digest", "Rich in antioxidants", "Lowers cholesterol", "Supports weight loss"],
  },
}
