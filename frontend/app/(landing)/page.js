
export default function Home() {
  return (
    <>
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6 text-center">
        <div>
          <h1 className="text-5xl md:text-7xl text-gray-900 font-extrabold mb-5">
            Beer 4 Crypto
          </h1>
        </div>
        <div>
          <span className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
            Meeting up with some crypto frens?
          </span>
        </div>
        <div className="max-w-3xl mx-auto mt-9">
          <p className="text-xl font-bold text-gray-400">
            Try to guess the futur price of ethereum and compete for a free beer
          </p>
          <p className="text-xl text-gray-400 mt-3">You said free beer ?</p>
          <p className="text-xl text-gray-400 mt-3">
            1) Create your private group and invite friends to join the game
          </p>
          <p className="text-xl text-gray-400 mt-3">
            2) Each participant deposits 5$ worth of ETH to enter the game.
          </p>
          <p className="text-xl text-gray-400 mt-3">
            3) The wallet who made the most accurate price prediction can
            withdraw from the smart contract.{" "}
          </p>
          <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center mt-12">
            <div className="w-full">
              {/* <Image
                src="/vesting.webp"
                width={1000}
                height={500}
                alt="vesting"
              /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}