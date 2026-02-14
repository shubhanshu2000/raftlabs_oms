export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

export interface MenuQuery {
  page?: number;
  limit?: number;
  category?: string;
}

export interface MenuResponse {
  menu: MenuItem[];
  total: number;
  page: number;
  limit: number;
}
