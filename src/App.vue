<script setup>
import playButton from "./components/icons/play.png";
import bulb from "./components/icons/bulb.png";
import prize from "./components/icons/prize.png";

</script>

<template>
  <div>
    <!-- Start Page -->
    <!-- <div id="startPage" class="bg-[#FEF9EF] flex flex-col items-center justify-center h-screen">
      <h1 class="text-[150px] justify-start text-[#237C9D] mt-[-75px]">CLICK WORD</h1>
      <img :src="playButton" alt="Play Button" class="w-60 h-60 mx-auto mb-[50px] mt-10 hover:scale-110">
      <div class="flex gap-80 mt-10">
        <div class="flex flex-col item-center gap-2">
          <img :src="prize" alt="Play Button" class="w-20 h-20 mx-auto my-auto mb-1 ">
          <h3 class="bg-[#19C3B2] text-[#FEF9EF] text-[20px] rounded-2xl p-3">Success (0%)</h3>
        </div>
        <div class="flex flex-col item-center gap-2">
          <img :src="bulb" alt="Play Button" class="w-20 h-20 mx-auto my-auto mb-1 mr-3 ">
          <h3 class="bg-[#FF9090] text-[#FEF9EF] text-[20px] rounded-2xl p-3">Hints (3)</h3>
        </div>
      </div>
    </div> -->

    <!-- Mode Page -->
    <!-- <div id="modePage" class="bg-[#FEF9EF] flex flex-col items-center justify-center h-screen gap-20">
      <h1 class="text-[130px] justify-start text-[#237C9D] mt-[-200px]">MODE</h1>
      <div class="flex flex-col gap-6 ">
        <button
          class="bg-[#19C3B2] text-[#FEF9EF] text-[40px] rounded-2xl px-8 hover:scale-110 hover:bg-[#20a396]">Easy</button>
        <button
          class="bg-[#FFCB77] text-[#FEF9EF] text-[40px] rounded-2xl px-8 hover:scale-110 hover:bg-[#ffb031]">Medium</button>
        <button
          class="bg-[#FE6D73] text-[#FEF9EF] text-[40px] rounded-2xl px-8 hover:scale-110 hover:bg-[#ee464c]">Hard</button>
      </div>
    </div> -->

    <!-- Play Page -->
    <div id="playPage">

    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Irish+Grover&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Itim&display=swap");

h1 {
  font-family: "Irish Grover", sans-serif;
  font-weight: 500;
  font-style: normal;
}

* {
  font-family: "Itim", cursive;
  font-weight: 400;
  font-style: normal;
}
</style>