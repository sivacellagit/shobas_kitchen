//import Footer from "../layout/Footer";
//import Layout from "../layout/Layout";
//import Header from "../layout/Header";

const Home = () => {
  return (
    
      <div className="bg-gradient-to-br from-yellow-50 via-white to-green-50 w-full">
        <section className="max-w-7xl mx-auto px-6 py-12 text-gray-800">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-green-800 mb-3">
              Welcome to <span className="italic text-green-700">Shoba’s Kitchen – Curry Club</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your Neighbourhood Takeaway for Authentic Home-Style Veg & Non-Veg Delights. <br />
              From comforting curries to crispy snacks, we serve homely flavors every day.
            </p>
          </header>

          {/* Signature Offerings */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-green-800 mb-6">🥘 Our Signature Offerings</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                ["🌶️ Curries", "Sambar • Chicken Gravy • Rasam • Fish Kulambu"],
                ["🍚 Variety Rice", "Lemon Rice • Vegetable Biryani • Tamarind Rice"],
                ["🍽️ Tiffin", "Idly • Dosa • Chapati"],
                ["🍟 Snacks", "Gobi 65 • Vada • Bajji"],
              ].map(([title, items]) => (
                <div className="bg-white rounded-lg shadow p-6" key={title}>
                  <h3 className="text-lg font-semibold mb-2">{title}</h3>
                  <p className="text-gray-700">{items}</p>
                </div>
              ))}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 shadow">
                <h3 className="font-semibold text-green-700 mb-1">🎒 School Lunches</h3>
                <p className="text-gray-700">Nutritious, kid-friendly lunch boxes for school children.</p>
              </div>
            </div>
          </section>

          {/* Loyalty */}
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-green-800 mb-4">🎁 Loyalty That Rewards You</h2>
            <ul className="list-disc list-inside bg-yellow-50 border border-yellow-200 rounded-lg shadow p-6 space-y-2">
              <li><strong>15% off</strong> on your first order as a welcome gift</li>
              <li><strong>5% off</strong> when trying a new item</li>
              <li>🎂 <strong>Birthday & anniversary discounts</strong></li>
              <li>💬 <strong>Earn points</strong> by sharing feedback</li>
              <li>⭐ <strong>Redeem points</strong> for future savings</li>
            </ul>
          </section>

          {/* CTA */}
          <section className="text-center bg-green-100 py-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-green-800 mb-2">🚚 Takeaway Made Simple</h3>
            <p className="text-gray-700">
              {/*Place your order online or offline and enjoy a smooth, fast, and delightful experience.*/}
              Browse our menu, place your order offline, and let us serve you food that feels like home
            </p>
            <p className="mt-3 font-medium text-green-900">
              👉 <strong>Home food is the best food</strong>
            </p>
          </section>
        </section>
      </div>
   
  );
};

export default Home;

{/*import Layout from "../layout/Layout";

const Home = () => {
 return (
  <Layout>
   <div className="bg-gradient-to-br from-yellow-50 via-white to-green-50 min-h-screen">
     {/*<Navbar />*/}
     {/* Add padding top to account for fixed navbar *
     <main className="max-w-4xl mx-auto px-4 pt-24 pb-10 text-gray-800">
       <header className="mb-10 text-center pt-24">
         <h1 className="text-3xl font-bold text-green-800 mb-2">
           Welcome to <span className="italic text-green-700">Shoba’s Kitchen – Curry Club</span>
         </h1>
         <p className="text-lg mb-4 italic text-gray-600">
           Your Neighbourhood Takeaway for Authentic Home-Style Veg & Non-Veg Delights
         </p>
         <p className="mb-2 text-gray-700">
           At <strong>Shoba’s Kitchen – Curry Club</strong>, we bring the warmth of home-cooked food to your table.<br />
           Specializing in both <strong>vegetarian and non-vegetarian</strong> dishes, we take pride in serving
           <strong> tasty, hygienic, and high-quality meals</strong> every single day.
         </p>
         <p className="mb-0 text-gray-700">
           Whether you're craving a comforting curry, a flavorful rice bowl, or a quick snack, our menu is designed to satisfy
           your hunger with authentic taste and soul-satisfying flavour.
         </p>
       </header>

       <section className="mb-10">
         <h2 className="text-2xl font-semibold text-green-800 mb-4 flex items-center gap-2">
           🥘 Our Signature Offerings
         </h2>
         <div className="grid md:grid-cols-2 gap-6">
           <div className="bg-white rounded-lg shadow p-4">
             <strong className="block mb-1 text-lg">🌶️ Curries (Veg & Non-Veg):</strong>
             <span className="text-gray-700">Sambar • Kaara Kulambu • Panneer Butter Masala • Chicken Gravy • Egg Gravy • Fish Kulambu • Rasam</span>
           </div>
           <div className="bg-white rounded-lg shadow p-4">
             <strong className="block mb-1 text-lg">🍚 Variety Rice:</strong>
             <span className="text-gray-700">Lemon Rice • Tomato Rice • Curd Rice • Vegetable Biryani • White Rice • Tamarind Rice</span>
           </div>
           <div className="bg-white rounded-lg shadow p-4">
             <strong className="block mb-1 text-lg">🍽️ Tiffin (Breakfast/Dinner):</strong>
             <span className="text-gray-700">Idly • Dosa • Chapati</span>
           </div>
           <div className="bg-white rounded-lg shadow p-4">
             <strong className="block mb-1 text-lg">🍟 Snacks:</strong>
             <span className="text-gray-700">Kuli Paniyaram • Gobi 65 • Chicken 65 • Vada • Bajji</span>
           </div>
         </div>
         <div className="bg-green-50 rounded-lg shadow p-4 mt-6">
           <strong className="block mb-1 text-lg">🎒 School Lunches Available:</strong>
           <span className="text-gray-700">We also provide nutritious, kid-friendly lunch options for school students.</span>
         </div>
       </section>


       <section className="mb-10">
         <h2 className="text-2xl font-semibold text-green-800 mb-3 flex items-center gap-2">
           🎁 Loyalty That Rewards You
         </h2>
         <ul className="list-disc list-inside space-y-2 bg-yellow-50 rounded-lg shadow p-4">
           <li>✅ <strong>15% off on your first order</strong> as a welcome gift</li>
           <li>✅ <strong>5% off</strong> every time you try a new menu item</li>
           <li>🎂 <strong>Special discounts</strong> on your birthday or wedding anniversary</li>
           <li>💬 <strong>Earn points</strong> when you share your feedback on our website or social media</li>
           <li>⭐ <strong>Redeem points</strong> for exciting rewards and future discounts</li>
         </ul>
       </section>


       <section className="mb-10">
         <h2 className="text-xl font-semibold text-green-800 mb-2 flex items-center gap-2">
           🚚 Takeaway Made Simple
         </h2>
         <p className="mb-6 text-gray-700">
           Place your order online or offline and enjoy a smooth, fast, and delightful experience every time.
         </p>
         <div className="bg-green-100 text-green-900 font-semibold px-6 py-4 rounded-lg text-center shadow">
           📞 Ready to Taste the Difference? <br />
           <span className="block mt-2">
             👉 Browse our menu, place your order, and let us serve you food that feels like home — because <strong>home food is the best food</strong>.
           </span>
         </div>
       </section>
      {/* <footer className="text-sm text-gray-600 border-t pt-6 mt-8 flex flex-col md:flex-row md:justify-between gap-2 bg-white rounded-b-xl">
         <div>
           <p><strong>FSSAI Registration No:</strong> 22423072000485</p>
           <p>
             <strong>Contact / WhatsApp:</strong>{" "}
             <a href="https://wa.me/917845502013" className="text-green-600 hover:underline">+91 78455 02013</a>
           </p>
         </div>
         <div>
           <p><strong>Address:</strong> No.6, Sri Mahalakshmai Nagar, Kolapakkam, Chennai 600122</p>
           <p>
             <strong>Website:</strong>{" "}
             <a href="https://www.shobaskitchen.com" target="_blank" rel="noreferrer" className="text-green-600 hover:underline">www.shobaskitchen.com</a>
           </p>
         </div>
         <div>
           <p><strong>Portal Access:</strong></p>
           <p><a href="/login-staff" className="hover:text-green-600 underline">Staff Login</a></p>
           <p><a href="/login-admin" className="hover:text-green-600 underline">Admin Login</a></p>
         </div>
       </footer>
       
     </main>
   </div>
   </Layout>
 );
};


export default Home;

*/}