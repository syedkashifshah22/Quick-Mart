import Image from "next/image";

const aboutSections = [
  {
    title: "Dress",
    description:
      "Our dress collection offers a perfect blend of modern style and timeless elegance. Each piece is crafted with premium fabrics that ensure both comfort and durability. Whether you're dressing up for a formal event or looking for something casual yet chic, we have something for every occasion. Our designers pay attention to the smallest details, adding unique touches like embroidery, lace, and vibrant prints. Available in a wide range of sizes and colors, these dresses are designed to make you feel confident and beautiful. We regularly update our collection to stay ahead of fashion trends. Explore seasonal looks or timeless classics to match your personal style. Perfect for parties, office wear, or relaxed weekends.",
    image: "/assets/About/dress.jpg",
    reverse: false,
  },
  {
    title: "Watch",
    description:
      "Our watch range combines precision engineering with stunning aesthetics to offer timepieces that are both reliable and stylish. Whether you prefer a classic leather strap or a modern metal finish, our collection caters to all tastes. Each watch is water-resistant and built with durable materials, ensuring long-lasting performance. From minimalistic designs to feature-rich chronographs, we have options for every occasion. Our watches are perfect for both daily wear and special events. Designed to complement both casual and formal outfits, they make a bold statement of sophistication. Explore limited editions and timeless classics alike. Gift a watch to someone special or upgrade your own collection.",
    image: "/assets/About/watches.jpg",
    reverse: true,
  },
  {
    title: "Ice Cream",
    description:
      "Indulge in our premium ice cream selection made with the finest natural ingredients. Every scoop is rich, creamy, and packed with delightful flavors that bring joy to all ages. We offer a wide variety of classic flavors like vanilla, chocolate, and strawberry, alongside unique creations that surprise your taste buds. Our ice creams are crafted in small batches to maintain exceptional quality and taste. We also have dairy-free and vegan-friendly options to cater to everyone. Whether you're enjoying a cone on a sunny day or adding a scoop to your favorite dessert, our ice cream is the perfect treat. Visit our store or order online for doorstep delivery. Taste the happiness in every bite!",
    image: "/assets/About/ice-cream.jpg",
    reverse: false,
  },
  {
    title: "Foods",
    description:
      "Our food menu is a celebration of fresh ingredients and authentic recipes. From hearty breakfasts to delicious dinners, every dish is prepared with care and passion. We focus on providing healthy, balanced meals without compromising on flavor. Our chefs bring global cuisines to your table, offering everything from spicy Asian dishes to comforting European classics. We also cater to special dietary needs with vegetarian, vegan, and gluten-free options. Each meal is beautifully presented and served in generous portions. Perfect for family gatherings, casual lunches, or business meetings. Experience fast service, friendly staff, and unforgettable flavors that keep you coming back. Taste the difference today!",
    image: "/assets/About/foods.jpg",
    reverse: true,
  },
];

export default function AboutHome() {
  return (
    <div className="py-18">
      <div className="text-center max-w-4xl mx-auto px-4">
        <h1 className="text-6xl mb-4">About</h1>
        <p className="text-2xl py-6">
          Welcome to Quick Mart – your go-to destination for fresh food and
          delightful ice creams! We are committed to bringing you a wide range
          of high-quality products, from everyday groceries to your favorite
          frozen treats, all at competitive prices.
        </p>
      </div>

      <div>
        <h1 className="text-6xl text-center py-6">Products</h1>
      </div>

      {aboutSections.map((section, index) => (
        <div
          key={index}
          className={`flex flex-col ${
            section.reverse ? "md:flex-row-reverse" : "md:flex-row"
          } items-center my-16`}
        >
          <div
            className={`md:w-1/2 mb-6 md:mb-0 ${
              section.reverse ? "md:pl-12" : "md:pr-12"
            }`}
          >
            <h3 className="text-5xl font-semibold mb-4">{section.title}</h3>
            <p className="text-gray-600 text-justify text-base md:text-sm lg:text-xl">
              {section.description}
            </p>
          </div>
          <div className="md:w-1/2">
            <Image
              src={section.image}
              alt={section.title}
              width={500}
              height={300}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
