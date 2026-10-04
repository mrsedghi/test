import { useState } from "react";

import { motion } from "motion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

function App() {
  const [count, setCount] = useState(1);

  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + "</span>";
    },
  };

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={50}
        slidesPerView={3}
        navigation
        pagination={pagination}
        scrollbar={{ draggable: true }}
      >
        <SwiperSlide>
          {" "}
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4sXGA5NJTC891dNDjlNRCUfbLED-D9oyh1ee-ool36Q&s=10"
            alt=""
          />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4sXGA5NJTC891dNDjlNRCUfbLED-D9oyh1ee-ool36Q&s=10"
            alt=""
          />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4sXGA5NJTC891dNDjlNRCUfbLED-D9oyh1ee-ool36Q&s=10"
            alt=""
          />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4sXGA5NJTC891dNDjlNRCUfbLED-D9oyh1ee-ool36Q&s=10"
            alt=""
          />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4sXGA5NJTC891dNDjlNRCUfbLED-D9oyh1ee-ool36Q&s=10"
            alt=""
          />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4sXGA5NJTC891dNDjlNRCUfbLED-D9oyh1ee-ool36Q&s=10"
            alt=""
          />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4sXGA5NJTC891dNDjlNRCUfbLED-D9oyh1ee-ool36Q&s=10"
            alt=""
          />
        </SwiperSlide>
        <SwiperSlide>
          {" "}
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4sXGA5NJTC891dNDjlNRCUfbLED-D9oyh1ee-ool36Q&s=10"
            alt=""
          />
        </SwiperSlide>{" "}
        <SwiperSlide>
          {" "}
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4sXGA5NJTC891dNDjlNRCUfbLED-D9oyh1ee-ool36Q&s=10"
            alt=""
          />
        </SwiperSlide>
      </Swiper>
      <motion.h1
        onClick={() => {
          setCount(count + 1);
        }}
        animate={{ rotate: 360, transition: { duration: 1 } }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
        className="text-2xl font-bold bg-blue-500 text-white p-4 w-fit rounded-lg m-4 cursor-pointer"
      >
        {count}
      </motion.h1>
    </>
  );
}

export default App;
