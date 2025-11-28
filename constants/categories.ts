export interface Category {
  id: string;
  label: string;
  textColor: string;
  bgColor: string;
}

export const categories: Category[] = [
  { id: 'reminder', label: 'Reminder', textColor: '#EC4D6B', bgColor: '#FEE7EF' },      // Pink
  { id: 'celebration', label: 'Celebration', textColor: '#47C2BE', bgColor: '#E4F7F6' }, // Teal
  { id: 'request', label: 'Request', textColor: '#F9BE1A', bgColor: '#FFF7DE' },         // Yellow
  { id: 'memory', label: 'Memory', textColor: '#7A6DAE', bgColor: '#F2F0FA' },           // Lavender
  { id: 'update', label: 'Update', textColor: '#56C6B2', bgColor: '#E9F7F6' },           // Light teal/green
  { id: 'groceries', label: 'Groceries', textColor: '#F97316', bgColor: '#FFF4E6' },           // Orange           
];


export const emojis: string[] = ["❤️", "😊", "🎉", "🎂", "🏡", "⚽", "📚", "🍕", "🎵", "🌟", "🎨", "🚗", "✈️", "☀️", "🌈", "🎁"];
