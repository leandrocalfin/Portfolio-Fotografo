const Contacto = () => {
  return (
    <section
      id="contacto"
      className="
        pt-4
        pb-12
        px-4
        max-w-7xl
        mx-auto
        w-full
        transition-colors
        duration-300

        sm:px-6
        sm:pb-14

        md:pb-14

        lg:pb-16
      "
    >
      {/* TITULO */}
      <div className="text-center mb-10 md:mb-10 lg:mb-16">
        <h3
          className="
            text-neutral-900
            dark:text-white
            font-bold
            tracking-[0.2em]
            uppercase
            text-lg
            md:text-lg
            lg:text-xl
            relative
            inline-block
            transition-colors
          "
        >
          Contacto

          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-azul-logo" />
        </h3>

        <p
          className="
            text-neutral-700
            dark:text-neutral-300
            font-textos
            transition-colors

            text-xs
            leading-6
            mt-7
            max-w-md
            mx-auto

            sm:text-sm

            md:text-[13px]
            md:max-w-md
            md:mt-7

            lg:text-sm
            lg:max-w-lg
            lg:mt-8
          "
        >
          ¿Tienes un proyecto en mente o un evento próximo? Escríbeme y
          empecemos a planificar cómo capturar tu historia.
        </p>
      </div>

      {/* FORMULARIO */}
      <div
        className="
          max-w-2xl
          mx-auto

          bg-[#78A4CB]/15
          dark:bg-neutral-900

          p-5
          sm:p-7

          md:max-w-[620px]
          md:p-7

          lg:max-w-3xl
          lg:p-12

          shadow-xl
          border-t-4
          border-t-azul-logo

          relative
          overflow-hidden

          transition-colors
        "
      >
        <form
          className="
            flex
            flex-col

            gap-5

            md:gap-5

            lg:gap-8

            relative
            z-10
          "
        >
          {/* NOMBRE + EMAIL */}
          <div
            className="
              grid
              grid-cols-1
              gap-5

              md:grid-cols-2
              md:gap-5

              lg:gap-8
            "
          >
            {/* NOMBRE */}
            <div className="flex flex-col gap-2 lg:gap-3">
              <label
                htmlFor="nombre"
                className="
                  text-[10px]
                  md:text-[10px]
                  lg:text-xs

                  font-bold
                  uppercase
                  tracking-[0.15em]

                  text-neutral-700
                  dark:text-neutral-300

                  ml-1
                "
              >
                Nombre
              </label>

              <input
                type="text"
                id="nombre"
                className="
                  bg-white/70
                  dark:bg-neutral-950

                  border-b
                  border-azul-logo/30

                  px-3
                  py-2.5

                  md:px-3
                  md:py-2.5

                  lg:px-4
                  lg:py-3

                  text-neutral-900
                  dark:text-white

                  focus:outline-none
                  focus:border-azul-logo

                  transition-colors
                  duration-300

                  font-textos

                  text-xs
                  md:text-xs
                  lg:text-sm

                  placeholder:text-neutral-400
                  dark:placeholder:text-neutral-600
                "
                placeholder="Tu nombre completo"
              />
            </div>

            {/* EMAIL */}
            <div className="flex flex-col gap-2 lg:gap-3">
              <label
                htmlFor="email"
                className="
                  text-[10px]
                  md:text-[10px]
                  lg:text-xs

                  font-bold
                  uppercase
                  tracking-[0.15em]

                  text-neutral-700
                  dark:text-neutral-300

                  ml-1
                "
              >
                Email
              </label>

              <input
                type="email"
                id="email"
                className="
                  bg-white/70
                  dark:bg-neutral-950

                  border-b
                  border-azul-logo/30

                  px-3
                  py-2.5

                  md:px-3
                  md:py-2.5

                  lg:px-4
                  lg:py-3

                  text-neutral-900
                  dark:text-white

                  focus:outline-none
                  focus:border-azul-logo

                  transition-colors
                  duration-300

                  font-textos

                  text-xs
                  md:text-xs
                  lg:text-sm

                  placeholder:text-neutral-400
                  dark:placeholder:text-neutral-600
                "
                placeholder="tu@email.com"
              />
            </div>
          </div>

          {/* MENSAJE */}
          <div className="flex flex-col gap-2 lg:gap-3">
            <label
              htmlFor="mensaje"
              className="
                text-[10px]
                md:text-[10px]
                lg:text-xs

                font-bold
                uppercase
                tracking-[0.15em]

                text-neutral-700
                dark:text-neutral-300

                ml-1
              "
            >
              Mensaje
            </label>

            <textarea
              id="mensaje"
              rows="4"
              className="
                bg-white/70
                dark:bg-neutral-950

                border-b
                border-azul-logo/30

                px-3
                py-2.5

                md:px-3
                md:py-2.5

                lg:px-4
                lg:py-3

                text-neutral-900
                dark:text-white

                focus:outline-none
                focus:border-azul-logo

                transition-colors
                duration-300

                font-textos

                text-xs
                md:text-xs
                lg:text-sm

                resize-none

                placeholder:text-neutral-400
                dark:placeholder:text-neutral-600
              "
              placeholder="Cuéntame sobre tu sesión ideal, fecha y ubicación..."
            />
          </div>

          {/* BOTON */}
          <div className="flex justify-center mt-2 lg:mt-4">
            <button
              type="button"
              className="
                text-[10px]
                md:text-[10px]
                lg:text-xs

                font-bold
                uppercase
                tracking-widest

                text-white

                border
                border-azul-logo

                bg-azul-logo

                px-7
                py-3

                md:px-7
                md:py-3

                lg:px-10
                lg:py-4

                hover:bg-transparent
                hover:text-neutral-900
                dark:hover:text-white

                transition-all
                duration-300

                w-full
                md:w-auto

                cursor-pointer
                shadow-md
              "
            >
              Enviar Mensaje
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contacto;