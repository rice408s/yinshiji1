export interface FoodRecord {
  _id: string
  food: string
  imageUrl: string
  count?: number
  unit?: string
  description?: string
  nutrients?: {
    calories: number
    protein: number
    carbohydrates: number
    fat: number
  }
  createdAt: Date
  updatedAt: Date
}
