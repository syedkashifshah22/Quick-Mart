import AboutHome from "./components/about";
import HeroUser from "./components/heroUser";
import ProductsHome from "./components/products";

export default function UserHome() {
    return (
        <>
        <HeroUser />
        <div className="container mx-auto px-4 lg::px-0">
            <AboutHome />
            <ProductsHome />
        </div>
        </>
    )
  }
  