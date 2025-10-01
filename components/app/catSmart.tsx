import React from 'react'

export default function CatSmartComp() {
    return (
        <section aria-labelledby="sale-heading mb-7">
            <div className="overflow-hidden pt-32 sm:pt-14">
                <div className=" rounded-tl-3xl">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="relative pt-48 pb-16 sm:pb-24">
                            <div>
                                <h2 id="sale-heading" className="text-4xl hover:text-pink-500 font-bold tracking-tight  md:text-5xl">
                                    Discover The best,
                                    <br />
                                    Smart wear.
                                </h2>
                                <div className="mt-6 text-base hover:text-pink-400">
                                    <a href="/products" className="font-semibold ">
                                        Shop now
                                        <span aria-hidden="true"> &rarr;</span>
                                    </a>
                                </div>
                            </div>

                            <div className="absolute -top-32 left-1/2 -translate-x-1/2 transform sm:top-6 sm:translate-x-0">
                                <div className="ml-24 flex min-w-max space-x-6 sm:ml-3 lg:space-x-8">
                                    <div className="flex space-x-6 sm:flex-col sm:space-y-6 sm:space-x-0 lg:space-y-8">
                                        <div className="shrink-0">
                                            <img
                                                alt=""
                                                src="https://i.pinimg.com/236x/e6/74/28/e674287ce80f69f4c19fd3d6c1d73012.jpg"
                                                className="size-64 rounded-lg object-cover md:size-72"
                                            />
                                        </div>

                                        <div className="mt-6 shrink-0 sm:mt-0">
                                            <img
                                                alt=""
                                                src="https://i.pinimg.com/236x/7a/c8/60/7ac8605067426e2dbe2bf71c169c2a28.jpg"
                                                className="size-64 rounded-lg object-cover md:size-72"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex space-x-6 sm:-mt-20 sm:flex-col sm:space-y-6 sm:space-x-0 lg:space-y-8">
                                        <div className="shrink-0">
                                            <img
                                                alt=""
                                                src="https://i.pinimg.com/236x/f2/96/40/f29640dc49fd00e4e5a67e61fb2aeb15.jpg"
                                                className="size-64 rounded-lg object-cover md:size-72"
                                            />
                                        </div>

                                        <div className="mt-6 shrink-0 sm:mt-0">
                                            <img
                                                alt=""
                                                src="https://i.pinimg.com/236x/cb/0d/45/cb0d455cb18b1f9afe6117d40e728b7a.jpg"
                                                className="size-64 rounded-lg object-cover md:size-72"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex space-x-6 sm:flex-col sm:space-y-6 sm:space-x-0 lg:space-y-8">
                                        <div className="shrink-0">
                                            <img
                                                alt=""
                                                src="https://tailwindui.com/plus-assets/img/ecommerce-images/home-page-03-category-01.jpg"
                                                className="size-64 rounded-lg object-cover md:size-72"
                                            />
                                        </div>

                                        <div className="mt-6 shrink-0 sm:mt-0">
                                            <img
                                                alt=""
                                                src="https://tailwindui.com/plus-assets/img/ecommerce-images/home-page-03-category-02.jpg"
                                                className="size-64 rounded-lg object-cover md:size-72"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}