// export interface Product {
//   id: string;
//   name: string;
//   price: number;
//   originalPrice?: number;
//   image: string;
//   category: string;
//   colors: string[];
//   sizes: string[];
//   rating: number;
//   reviews: number;
//   isNew?: boolean;
//   description: string;
// }

// export const products: Product[] = [
//   {
//     id: "1",
//     name: "Abstract Print Shirt",
//     price: 99,
//     image: "/products/shirt-1.jpg",
//     category: "Shirts",
//     colors: ["Black", "White", "Navy"],
//     sizes: ["XS", "S", "M", "L", "XL", "2X"],
//     rating: 4.5,
//     reviews: 2,
//     isNew: true,
//     description:
//       "Relaxed-fit shirt. Camp collar and short sleeves. Button-up front.",
//   },
//   {
//     id: "2",
//     name: "Basic Heavy T-Shirt",
//     price: 99,
//     image: "/products/tshirt-1.jpg",
//     category: "T-Shirts",
//     colors: ["Black", "White", "Gray"],
//     sizes: ["XS", "S", "M", "L", "XL", "2X"],
//     rating: 4.8,
//     reviews: 1,
//     description:
//       "Premium heavyweight cotton t-shirt with a comfortable relaxed fit.",
//   },
//   {
//     id: "3",
//     name: "Basic Fit T-Shirt",
//     price: 99,
//     image: "/products/tshirt-2.jpg",
//     category: "T-Shirts",
//     colors: ["Black", "White", "Beige"],
//     sizes: ["XS", "S", "M", "L", "XL", "2X"],
//     rating: 4.6,
//     reviews: 1,
//     description:
//       "Classic fit t-shirt made from soft cotton blend for everyday comfort.",
//   },
//   {
//     id: "4",
//     name: "Basic Slim Fit T-Shirt",
//     price: 99,
//     image: "/products/tshirt-3.jpg",
//     category: "T-Shirts",
//     colors: ["Black", "White", "Navy", "Olive"],
//     sizes: ["XS", "S", "M", "L", "XL", "2X"],
//     rating: 4.7,
//     reviews: 1,
//     description:
//       "Slim fit t-shirt with a modern silhouette. Perfect for layering.",
//   },
//   {
//     id: "5",
//     name: "Full Sleeve Zipper",
//     price: 199,
//     image: "/products/jacket-1.jpg",
//     category: "Jackets",
//     colors: ["Black", "Navy", "Olive"],
//     sizes: ["XS", "S", "M", "L", "XL", "2X"],
//     rating: 4.9,
//     reviews: 1,
//     isNew: true,
//     description:
//       "Full sleeve jacket with front zipper closure. Perfect for layering.",
//   },
//   {
//     id: "6",
//     name: "Cotton T-Shirt",
//     price: 199,
//     image: "/products/tshirt-4.jpg",
//     category: "T-Shirts",
//     colors: ["Black", "White", "Gray", "Navy", "Olive"],
//     sizes: ["XS", "S", "M", "L", "XL", "2X"],
//     rating: 4.5,
//     reviews: 1,
//     description:
//       "100% cotton t-shirt with a premium feel and excellent durability.",
//   },
//   {
//     id: "7",
//     name: "Crewneck T-Shirt",
//     price: 99,
//     image: "/products/tshirt-5.jpg",
//     category: "T-Shirts",
//     colors: ["Black", "White", "Gray", "Navy", "Beige", "Olive"],
//     sizes: ["XS", "S", "M", "L", "XL", "2X"],
//     rating: 4.4,
//     reviews: 6,
//     description:
//       "Classic crewneck t-shirt with comfortable fit and soft fabric.",
//   },
//   {
//     id: "8",
//     name: "V-Neck T-Shirt",
//     price: 99,
//     image: "/products/tshirt-6.jpg",
//     category: "T-Shirts",
//     colors: ["Black", "White", "Gray", "Navy", "Beige"],
//     sizes: ["XS", "S", "M", "L", "XL", "2X"],
//     rating: 4.3,
//     reviews: 5,
//     description: "V-neck t-shirt with modern cut and breathable cotton blend.",
//   },
//   {
//     id: "9",
//     name: "Henley T-Shirt",
//     price: 129,
//     image: "/products/tshirt-7.jpg",
//     category: "T-Shirts",
//     colors: ["Black", "White", "Beige"],
//     sizes: ["XS", "S", "M", "L", "XL", "2X"],
//     rating: 4.6,
//     reviews: 3,
//     description: "Henley-style t-shirt with button placket and relaxed fit.",
//   },
//   {
//     id: "10",
//     name: "Embroidered Seersucker Shirt",
//     price: 99,
//     image: "/products/shirt-2.jpg",
//     category: "Shirts",
//     colors: ["White", "Light Blue"],
//     sizes: ["XS", "S", "M", "L", "XL", "2X"],
//     rating: 4.8,
//     reviews: 2,
//     isNew: true,
//     description:
//       "Lightweight seersucker shirt with delicate embroidery details.",
//   },
//   {
//     id: "11",
//     name: "Blurred Print T-Shirt",
//     price: 99,
//     image: "/products/tshirt-8.jpg",
//     category: "T-Shirts",
//     colors: ["Black", "White"],
//     sizes: ["XS", "S", "M", "L", "XL", "2X"],
//     rating: 4.5,
//     reviews: 1,
//     description: "Artistic blurred print design on premium cotton fabric.",
//   },
//   {
//     id: "12",
//     name: "Basic Heavy Weight T-Shirt",
//     price: 199,
//     image: "/products/tshirt-9.jpg",
//     category: "T-Shirts",
//     colors: ["Black", "White", "Gray"],
//     sizes: ["XS", "S", "M", "L", "XL", "2X"],
//     rating: 4.7,
//     reviews: 1,
//     description:
//       "Premium heavyweight t-shirt with superior construction and feel.",
//   },
//   {
//     id: "13",
//     name: "Soft Wash Straight Fit Jeans",
//     price: 199,
//     image: "/products/jeans-1.jpg",
//     category: "Jeans",
//     colors: ["Blue", "Black", "Gray"],
//     sizes: ["28", "30", "32", "34", "36", "38"],
//     rating: 4.6,
//     reviews: 5,
//     description:
//       "Soft wash jeans with straight leg fit. Comfortable and stylish.",
//   },
//   {
//     id: "14",
//     name: "Polo Shirt Classic",
//     price: 129,
//     image: "/products/polo-1.jpg",
//     category: "Polo Shirts",
//     colors: ["Black", "White", "Navy", "Red"],
//     sizes: ["XS", "S", "M", "L", "XL", "2X"],
//     rating: 4.5,
//     reviews: 3,
//     description:
//       "Classic polo shirt with ribbed collar and cuffs. Timeless style.",
//   },
//   {
//     id: "15",
//     name: "Casual Shorts",
//     price: 79,
//     image: "/products/shorts-1.jpg",
//     category: "Shorts",
//     colors: ["Khaki", "Navy", "Black", "Olive"],
//     sizes: ["XS", "S", "M", "L", "XL", "2X"],
//     rating: 4.4,
//     reviews: 2,
//     description: "Comfortable casual shorts perfect for warm weather.",
//   },
//   {
//     id: "16",
//     name: "Slim Fit Suit Jacket",
//     price: 399,
//     image: "/products/suit-1.jpg",
//     category: "Suits",
//     colors: ["Black", "Navy", "Charcoal"],
//     sizes: ["36", "38", "40", "42", "44", "46"],
//     rating: 4.9,
//     reviews: 4,
//     description: "Modern slim fit suit jacket. Perfect for formal occasions.",
//   },
// ];

export const categories = [
  "All",
  "Shirts",
  "Polo Shirts",
  "T-Shirts",
  "Shorts",
  "Jeans",
  "Jackets",
  "Suits",
];

export const collections = [
  { id: "summer-2024", name: "Summer 2024", image: "/collections/summer.jpg" },
  { id: "new-arrivals", name: "New Collection", image: "/collections/new.jpg" },
  {
    id: "best-sellers",
    name: "Best Sellers",
    image: "/collections/bestsellers.jpg",
  },
];
