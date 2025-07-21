// Example: Assuming your category data structure looks like this
export interface HeroContent {
  title?: string;
  subtitle?: string;
  image: {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string; // Optional, as you might have some images without blurDataURL
    blurWidth?: number;    // Optional
    blurHeight?: number;   // Optional
  };
}

export interface CategoryData {
  id: number;
  slug?: string;
  name: string;
  image: {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
    blurWidth?: number;
    blurHeight?: number;
  };
  hero?: HeroContent;
  children?: CategoryData[]; // Recursive: children can also be CategoryData
}

export const categoryData: CategoryData[] = [
  {
    id: 1,
    slug: 'home-kitchen',
    name: 'Home & Kitchen',
    image: {
      src: '/home_2.png', //  Use relative paths that Next.js can resolve
      height: 300,  //  set actual values
      width: 400,
    },
    hero: {
      title: 'Home & Kitchen!',
      subtitle: 'Your adventure begins here.',
      image: {
        src: '/home.jpg',
        height: 400,
        width: 600,
      },
    },
    children: [
      { id: 201, slug: 'furniture', name: 'Furniture', image: {src: '', height: 0, width: 0} },
      { id: 202, slug: 'appliances', name: 'Appliances', image: {src: '', height: 0, width: 0} },
    ],
  },
  {
    id: 2,
    slug: 'electronics',
    name: 'Electronics',
    image: {
        src: '/electronics.png',
        height: 300,
        width: 400,
    },
    hero: {
      title: '',
      subtitle: '',
      image: {
        src: '/electroic_hero.jpg',
        height: 400,
        width: 600,
      },
    },
    children: [
      {
        id: 101,
        slug: 'laptops',
        name: 'Laptops',
        image: {src: '', height: 0, width: 0},
        children: [
          { id: 1001, slug: 'gaming-laptops', name: 'Gaming Laptops', image: {src: '', height: 0, width: 0} },
          { id: 1002, slug: 'ultrabooks', name: 'Ultrabooks', image: {src: '', height: 0, width: 0} },
        ],
      },
      {
        id: 102,
        slug: 'smartphones',
        name: 'Smartphones',
        image: {src: '', height: 0, width: 0},
        children: [
          { id: 1003, slug: 'android-phones', name: 'Android Phones', image: {src: '', height: 0, width: 0} },
          { id: 1004, slug: 'iphones', name: 'iPhones', image: {src: '', height: 0, width: 0} },
        ],
      },
    ],
  },
  {
    id: 3,
    slug: 'automobile',
    name: 'Automobile',
    image: {
        src: '/auto_1.png',
        height: 300,
        width: 400,
    },
    hero: {
      title: '',
      subtitle: '',
      image: {
        src: '/auto_hero.jpg',
        height: 400,
        width: 600,
      },
    },
    children: [
      {
        id: 101,
        slug: 'care',
        name: 'Care',
        image: {src: '', height: 0, width: 0},
        children: [
          { id: 1001, slug: 'interior', name: 'Interior', image: {src: '', height: 0, width: 0} },
          { id: 1002, slug: 'exterior', name: 'Exterior', image: {src: '', height: 0, width: 0} },
        ],
      },
      {
        id: 102,
        slug: 'parts',
        name: 'Parts',
        image: {src: '', height: 0, width: 0},
        children: [
          { id: 1003, slug: 'lighting', name: 'Lighting', image: {src: '', height: 0, width: 0} },
          { id: 1004, slug: 'filter', name: 'Filter', image: {src: '', height: 0, width: 0} },
        ],
      },
    ],
  },
  {
    id: 4,
    slug: 'fashion',
    name: 'Fashion',
     image: {
        src: '/fashion_1.png',
        height: 300,
        width: 400,
    },
    hero: {
      title: 'Fashion Sense',
      subtitle: 'Your adventure begins here.',
      image: {
        src: '/fashion_hero.jpg',
        height: 400,
        width: 600,
      },
    },
    children: [
      {
        id: 101,
        slug: 'men',
        name: 'Men',
        image: {src: '', height: 0, width: 0},
        children: [
          { id: 1001, slug: 'shoes', name: 'Shoes', image: {src: '', height: 0, width: 0} },
          { id: 1002, slug: 'pants', name: 'Pants', image: {src: '', height: 0, width: 0} },
        ],
      },
      {
        id: 102,
        slug: 'women',
        name: 'Women',
        image: {src: '', height: 0, width: 0},
        children: [
          { id: 1003, slug: 'shoes', name: 'Shoes', image: {src: '', height: 0, width: 0} },
          { id: 1004, slug: 'dresses', name: 'Dresses', image: {src: '', height: 0, width: 0} },
        ],
      },
    ],
  },
];
