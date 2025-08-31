// import type { Order } from "./types";

// export const mockOrders: Order[] = [
//   {
//     id: "ORD-1703847291",
//     items: [
//       {
//         id: "item-1",
//         menuItem: {
//           id: "espresso",
//           name: "Signature Espresso",
//           description:
//             "Rich, bold espresso with notes of chocolate and caramel",
//           price: 4.5,
//           image: "/placeholder-5bbrm.jpg",
//           category: "coffee",
//           modifiers: [
//             {
//               id: "size",
//               name: "Size",
//               type: "size",
//               required: true,
//               multiple: false,
//               options: [{ id: "medium", name: "Medium (12oz)", price: 0.5 }],
//             },
//           ],
//         },
//         quantity: 2,
//         selectedModifiers: {
//           size: ["medium"],
//         },
//         totalPrice: 10.0,
//       },
//       {
//         id: "item-2",
//         menuItem: {
//           id: "croissant",
//           name: "Artisan Butter Croissant",
//           description: "Flaky, buttery pastry made with French technique",
//           price: 3.75,
//           image: "/golden-butter-croissant.png",
//           category: "snacks",
//           modifiers: [],
//         },
//         quantity: 1,
//         selectedModifiers: {},
//         totalPrice: 3.75,
//       },
//     ],
//     status: "in-progress",
//     orderType: "takeaway",
//     customerNotes: "Extra hot please",
//     totalAmount: 15.67,
//     createdAt: new Date("2024-12-29T10:30:00"),
//     estimatedTime: 12,
//   },
//   {
//     id: "ORD-1703843691",
//     items: [
//       {
//         id: "item-3",
//         menuItem: {
//           id: "matcha-latte",
//           name: "Premium Matcha Latte",
//           description:
//             "Ceremonial grade Japanese matcha with creamy steamed milk",
//           price: 4.95,
//           image: "/matcha-latte-foam-art.png",
//           category: "tea",
//           modifiers: [
//             {
//               id: "size",
//               name: "Size",
//               type: "size",
//               required: true,
//               multiple: false,
//               options: [{ id: "large", name: "Large (20oz)", price: 1.0 }],
//             },
//             {
//               id: "milk",
//               name: "Milk Choice",
//               type: "milk",
//               required: true,
//               multiple: false,
//               options: [{ id: "oat", name: "Oat Milk", price: 0.6 }],
//             },
//           ],
//         },
//         quantity: 1,
//         selectedModifiers: {
//           size: ["large"],
//           milk: ["oat"],
//         },
//         totalPrice: 6.55,
//       },
//     ],
//     status: "ready",
//     orderType: "dine-in",
//     tableNumber: "12",
//     totalAmount: 7.45,
//     createdAt: new Date("2024-12-29T09:15:00"),
//     estimatedTime: 5,
//   },
//   {
//     id: "ORD-1703840091",
//     items: [
//       {
//         id: "item-4",
//         menuItem: {
//           id: "caramel-macchiato",
//           name: "Caramel Macchiato",
//           description: "Smooth espresso with steamed milk and caramel drizzle",
//           price: 5.25,
//           image: "/placeholder-e0reo.png",
//           category: "coffee",
//           modifiers: [],
//         },
//         quantity: 1,
//         selectedModifiers: {},
//         totalPrice: 5.25,
//       },
//       {
//         id: "item-5",
//         menuItem: {
//           id: "avocado-toast",
//           name: "Avocado Toast",
//           description: "Fresh avocado mash on artisan sourdough",
//           price: 6.95,
//           image: "/placeholder-e0reo.jpg",
//           category: "snacks",
//           modifiers: [],
//         },
//         quantity: 1,
//         selectedModifiers: {},
//         totalPrice: 6.95,
//       },
//     ],
//     status: "completed",
//     orderType: "delivery",
//     customerNotes: "Please ring the doorbell twice",
//     totalAmount: 13.89,
//     createdAt: new Date("2024-12-28T16:45:00"),
//   },
//   {
//     id: "ORD-1703836491",
//     items: [
//       {
//         id: "item-6",
//         menuItem: {
//           id: "cold-brew",
//           name: "Cold Brew Coffee",
//           description: "Smooth, refreshing cold brew steeped for 12 hours",
//           price: 4.75,
//           image: "/cold-brew-with-ice.png",
//           category: "coffee",
//           modifiers: [],
//         },
//         quantity: 1,
//         selectedModifiers: {},
//         totalPrice: 4.75,
//       },
//     ],
//     status: "completed",
//     orderType: "takeaway",
//     totalAmount: 5.39,
//     createdAt: new Date("2024-12-28T14:20:00"),
//   },
// ];
