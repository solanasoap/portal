<template>
  <div class="flex text-white">
    <div class="lg:px-6 font-neueHaasUnicaRegular">
      <div class="pt-24 py-6">
        <div
          class="text-5xl lg:text-6xl md:text-4xl font-bold lg:w-5/6 font-phenomenaBlack text-transparent bg-clip-text bg-gradient-to-r from-greenBottomLeft to-greenTopRight"
        >
          The smoothest tokens in town.
        </div>
      </div>
      <div class="py-2 text-lg lg:w-5/6">
        <p>
          Soap enables you to easily create and distribute digital collectibles
          to your community.
        </p>
      </div>
      <div class="py-8 flex-row flex gap-4 lg:justify-start">
        <NuxtLink to="/soaps">
          <button
            class="bg-gradient-to-tr from-[#e10b00] to-RBGradient-Red-Left hover:shadow-md uppercase font-neueHaasUnicaBlack text-white font-bold py-2 px-4 rounded w-auto h-16 drop-shadow-lg m-auto lg:m-0"
          >
            see your soaps
          </button>
        </NuxtLink>
        <NuxtLink to="/dealer/YngRrzzvjvdAhWTCyNMgvyrmeJ8jt4hL7NUqaK4derF">
          <button
            class="bg-gradient-to-tr from-phantomTopRight to-justPurple hover:shadow-md uppercase font-neueHaasUnicaBlack text-white font-bold py-2 px-4 rounded w-auto h-16 drop-shadow-lg m-auto lg:m-0"
          >
            try dispenser
          </button>
        </NuxtLink>
        <NuxtLink to="/creator">
          <button
            class="bg-gradient-to-tr from-green-600 to-green-500 hover:shadow-md uppercase font-neueHaasUnicaBlack text-white font-bold py-2 px-4 rounded w-auto h-16 drop-shadow-lg m-auto lg:m-0"
          >
            Create Soap
          </button>
        </NuxtLink>
      </div>
      <div
        class="text-transparent bg-clip-text bg-gradient-to-r from-greenBottomLeft to-greenTopRight overflow-hidden whitespace-nowrap"
      >
        <NuxtLink to="https://t.me/oyacaro">
          <div class="flex-row flex items-center">
            <p class="text-lg font-bold font-neueHaasUnicaRegular">Contact</p>
            <!-- <BsLink45Deg class="text-greenTopRight" /> -->
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
