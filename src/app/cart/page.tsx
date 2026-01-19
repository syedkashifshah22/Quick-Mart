"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/app/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/UI/CartContext";

interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  size?: string | null;
}

export default function CartPage() {
  const [cartItem, setCartItem] = useState<CartItem | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [productId, setProductId] = useState<string | null>(null); // ✅ client-only param
  const router = useRouter();
  const { addToCart } = useCart();

  // ✅ Get productId from URL on client-side only
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setProductId(params.get("productId"));
  }, []);

  // ✅ Fetch cart item
  useEffect(() => {
    const fetchCartItem = async () => {
      if (!auth.currentUser || !productId) return;

      try {
        const itemsCol = collection(db, "cart", auth.currentUser.uid, "items");
        const snapshot = await getDocs(itemsCol);
        const item = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as CartItem))
          .find((i) => i.productId === productId);

        if (item) {
          setCartItem(item);
          setQuantity(item.quantity);
        }
      } catch (error) {
        console.error("Error fetching cart item:", error);
      }
    };

    fetchCartItem();
  }, [productId]);

  if (!auth.currentUser)
    return <p className="text-center py-10">Please login first.</p>;

  if (!cartItem)
    return <p className="text-center py-10">Your cart is empty.</p>;

  const { id, title, price, image, size } = cartItem;
  const total = price * quantity;

  const handleQuantityChange = async (newQuantity: number) => {
    const q = Math.max(1, newQuantity);
    setQuantity(q);

    try {
      const docRef = doc(db, "cart", auth.currentUser!.uid, "items", id);
      await updateDoc(docRef, { quantity: q });
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleAddToCart = async () => {
    if (!auth.currentUser) return alert("Login first!");

    addToCart({
      productId: cartItem.productId,
      title: cartItem.title,
      price: cartItem.price,
      quantity,
      image: cartItem.image,
      size: cartItem.size || null,
    });

    alert("Added to cart!");
  };

  const handleBuyNow = () => {
    router.push(`/checkout?productId=${cartItem.productId}&quantity=${quantity}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="md:w-1/2 flex justify-center">
          <Image
            src={image}
            alt={title}
            width={400}
            height={500}
            className="rounded object-cover"
          />
        </div>

        <div className="md:w-1/2 flex flex-col gap-4">
          <h3 className="text-2xl font-bold">{title}</h3>
          {size && <p className="text-gray-500">Size: {size}</p>}
          <p className="text-xl font-semibold mt-2">
            Price: Rs. {price.toLocaleString()}
          </p>

          <div className="flex flex-col mt-4 gap-2">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => handleQuantityChange(Number(e.target.value))}
                className="w-14 text-center border rounded"
              />
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>
            <span className="self-end text-lg font-semibold mt-4">
              Total: Rs. {total.toLocaleString()}
            </span>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-black hover:bg-gray-900 text-white py-3 rounded"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
