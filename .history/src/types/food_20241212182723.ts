export interface FoodRecord {
  _id: string
  imageUrl: string
  food: string
  count?: number
  unit?: string
  nutrients?: {
    calories: number
    carbohydrates: number
    protein: number
    fat: number
  }
  description?: string
  createdAt: string | Date
  _openid?: string
  fileID?: string
}
