// // src/components/ProductList.js
// import { useEffect, useState } from "react";

// function ProductList() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:8080/products")
//       .then((response) => response.json())
//       .then((data) => setProducts(data))
//       .catch((error) => console.error("Error:", error));
//   }, []);

//   return (
//     <div>
//       <h2>Menu Kopi</h2>
//       <ul>
//         {products.map((product) => (
//           <li key={product.id}>
//             {product.name} - Rp {product.price}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default ProductList;
