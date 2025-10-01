"use client";

import React, {
	useEffect,
	useRef,
	useState,
} from "react";
import LoadingCompPop from "./LoadingCompPop";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/store/actions/productActions";
import { RootState } from "@/store";
import { fetchCategory } from "@/store/actions/productAttrAction";
import CatSmartComp from "./catSmart";
import IncentivesComp from "./incetives";
import CatLingerieComp from "./catLingerie";
// import useEmblaCarousel from "embla-carousel-react";
// import AutoScroll from "embla-carousel-auto-scroll";
// import Autoplay from 'embla-carousel-autoplay'

 
const incentives = [
  {
    name: 'Country-wide delivery',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce/icons/icon-shipping-simple.svg',
    description: "24 hours delivery within Lusaka. 24-72 hours outside Lusaka. We use your preffered courier service.",
  },
  {
    name: 'Trust',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce/icons/icon-warranty-simple.svg',
    description: "Cash on delivery for Lusaka orders only. Prepaid for out side lusaka orders.",
  },
  {
    name: 'Exellent Products',
    imageSrc: 'https://tailwindcss.com/plus-assets/img/ecommerce/icons/icon-exchange-simple.svg',
    description:
      "Tested and Trusted products, we want to give you value for your money.",
  },
]

// export function HeadSection() {
//   return (
//     <div className="">
//       <div className="mx-auto max-w-7xl py-24 sm:px-2 sm:py-32 lg:px-4">
//         <div className="mx-auto max-w-2xl px-4 lg:max-w-none">
//           <div className="grid grid-cols-1 items-center gap-x-16 gap-y-10 lg:grid-cols-2">
//             <div>
//               <h2 className="text-4xl font-bold tracking-tight text-gray-900">
//                 Yanda's Collection
//               </h2>
//               <p className="mt-4 text-gray-500">
//                 At the beginning at least, but then we realized we could make a lot more money if we kinda stopped
//                 caring about that. Our new strategy is to write a bunch of things that look really good in the
//                 headlines, then clarify in the small print but hope people don't actually read it.
//               </p>
//             </div>
//             <img
//               alt=""
//               src="https://tailwindcss.com/plus-assets/img/ecommerce-images/incentives-07-hero.jpg"
//               className="aspect-3/2 w-full rounded-lg bg-gray-100 object-cover"
//             />
//           </div>
//           <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
//             {incentives.map((incentive) => (
//               <div key={incentive.name} className="sm:flex lg:block">
//                 <div className="sm:shrink-0">
//                   <img alt="" src={incentive.imageSrc} className="size-16" />
//                 </div>
//                 <div className="mt-4 sm:mt-0 sm:ml-6 lg:mt-6 lg:ml-0">
//                   <h3 className="text-sm font-medium text-gray-900">{incentive.name}</h3>
//                   <p className="mt-2 text-sm text-gray-500">{incentive.description}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


export function HeadSection() {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="overflow-hidden">
      <div
        className={`mx-auto max-w-7xl py-24 sm:px-2 sm:py-32 lg:px-4 transform transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-2xl px-4 lg:max-w-none">
          <div className="grid grid-cols-1 items-center gap-x-16 gap-y-10 lg:grid-cols-2">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                Yanda&apos;s Collection
              </h2>
              <p className="mt-4 text-gray-500">
                At the beginning at least, but then we realized we could make a lot
                more money if we kinda stopped caring about that. Our new strategy is
                to write a bunch of things that look really good in the headlines,
                then clarify in the small print but hope people don&apos;t actually
                read it.
              </p>
            </div>
            <img
              alt="Image by jacqueline macou from  Pixabay"
              src="hero.jpg"
              className="aspect-3/2 w-full rounded-lg bg-gray-100 object-cover"
            />
          </div>

          {/* Example incentives */}
          <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
            {incentives.map((incentive, i) => (
              <div
                key={incentive.name}
                className={`sm:flex lg:block transform transition-all duration-700 ease-out delay-${
                  i * 200
                } ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
              >
                <div className="sm:shrink-0">
                  <img alt="" src={incentive.imageSrc} className="size-16" />
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-6 lg:mt-6 lg:ml-0">
                  <h3 className="text-sm font-medium text-gray-900">
                    {incentive.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {incentive.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


type ProductListProps = {
  catName: string
  categoryId: string | number | undefined
  products?: any[]
  limit?: number
}

function ProductList({
  catName,
  categoryId,
  products,
  limit = 4,
}: ProductListProps) {

  const filtered = (products ?? [])
    .filter((p) => p.categoryId === categoryId)
    .slice(0, limit)

  if (!filtered.length) return null

  return (
    <section aria-labelledby={`${catName}-heading`} className="bg-white">
      <div className="py-16 sm:py-24 lg:mx-auto lg:max-w-7xl lg:px-8 lg:py-7">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-0">
          <h2
            id={`${catName}-heading`}
            className="text-2xl font-bold tracking-tight text-gray-900"
          >
            {catName}
          </h2>
          <a
            href="/products"
            className="hidden text-sm font-semibold text-red-600 hover:text-red-500 sm:block"
          >
            See everything <span aria-hidden="true"> &rarr;</span>
          </a>
        </div>

        <div className="relative mt-8">
          <div className="relative w-full overflow-x-auto">
            <ul
              role="list"
              className="mx-4 inline-flex space-x-8 sm:mx-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-x-8 lg:space-x-0"
            >
              {(filtered??[]).map((product) => (
                <li
                  key={product.id}
                  className="inline-flex w-64 flex-col text-center lg:w-auto"
                >
                  <div className="group relative">
                    <div className="aspect-[3/4] w-full overflow-hidden rounded-md bg-gray-200">
                      <img
                        alt={product.name}
                        src={product.thumb}
                        className="h-full w-full object-cover group-hover:opacity-75 transition"
                      />
                    </div>
                    <div className="mt-6">
                      <h3 className="mt-1 font-semibold text-gray-900">
                        <a href={`/products/${product.id}`}>
                          <span className="absolute inset-0" />
                          {product.name}
                        </a>
                      </h3>
                      <p className="mt-1 text-gray-900">ZMW {product.price}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}


export default function HomeBodyProducts() {
	const [loading, setLoading] = useState(true);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(fetchCategory()).then(() => setLoading(false));
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchProducts());
	}, [dispatch]);

	const category = useAppSelector(
		(state: RootState) => state.products.category || []
	) as any[];

	const products = useAppSelector(
		(state: RootState) => state.products.products
	) as any;
 

	if (loading && ! products) return <LoadingCompPop />;

	 
	return (
		<>

			<HeadSection/>
			{/* category barner for office wear  */}
			{category?.length > 0 ? (
				<>
					<CatSmartComp />
					  <ProductList
						catName="Office Wear"
						categoryId={category?.[0]?.id}
            			products={products?.data}
					/>  
					<CatLingerieComp />
					 <ProductList
						catName="Nighties"
						categoryId={category?.[1]?.id}
            			products={products?.data}
					/>  
					<IncentivesComp />
					 <ProductList
						catName="Lingerie"
						categoryId={category?.[2]?.id}
            			products={products?.data}
					/>  
					  <ProductList
						catName="Swim"
						categoryId={category?.[3]?.id}
            			products={products?.data}
					/>  
				</>
			):(
				<>
					<div role="status" className="animate-pulse">
						<div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[640px] mb-2.5 mx-auto"></div>
						<div className="h-2.5 mx-auto bg-gray-300 mb-3 rounded-full dark:bg-gray-700 max-w-[540px]"></div>
						<div className="h-2.5 mx-auto bg-gray-300 rounded-full dark:bg-gray-600 max-w-[340px]"></div>
						<span className="sr-only">Loading...</span>
					</div>					
					<div className="grid grid-cols-1 md:grid-cols-3 my-8 lg:grid-cols-3 gap-4 px-4 md:px-0 max-w-7xl mx-auto ">
					{[1,2,3].map((n)=>(

					<div role="status" className="max-w-sm p-4 border border-gray-200 rounded-sm shadow-sm animate-pulse md:p-6 dark:border-gray-700">
						<div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded-sm dark:bg-gray-700">
							<svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
								<path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"/>
								<path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
							</svg>
						</div>
						<div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
						<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
						<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
						<div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
						 
						<span className="sr-only">Loading...</span>
					</div>

					))}
					</div>


				</>
			)}
		</>
	);
}
