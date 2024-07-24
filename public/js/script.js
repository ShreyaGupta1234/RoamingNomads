(() => {
    "use strict";

    //fetch all the forms we want to apply custom Bootstrap validation styles 
    const forms = document.querySelectorAll(".needs-validation");

    //lopp over them and prevent submission
    Array.from(forms).forEach((form) => {
        form.addEventListener(
            "submit",
            (event) => {
                if(!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                form.classList.add("was-validated");
            },
            false
        );
    });
})();