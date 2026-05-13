export interface Category {

  id: number;
  name: string;
  slug: string;
  parentId?: number;
  parentName?: string;
  active: boolean;

}