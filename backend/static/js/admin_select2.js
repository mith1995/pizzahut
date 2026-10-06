django.jQuery(document).ready(function ($) {
  $(
    "<style type='text/css'> " +
      ".select2-container--default .select2-selection--multiple .select2-selection__choice { color: #333333 !important; background-color: #e4e4e4 !important; border: 1px solid #aaa !important; } " +
      ".select2-container--default .select2-search--inline .select2-search__field { color: #333333 !important; } " +
      ".select2-results__option { color: #333333 !important; } " +
      "</style>",
  ).appendTo("head");

  $("select[multiple]").select2({
    placeholder: "Please Choose",
    allowClear: true,
    width: "100%",
  });
});

(function ($) {
  $(document).ready(function () {
    const imageField = $("#id_image");

    imageField.after(`
            <div id="preview-wrapper" style="margin-top:10px;">
                <img
                    id="image-preview"
                    style="max-width:250px;max-height:250px;display:none;"
                />

                <br><br>

                <button
                    type="button"
                    id="remove-image"
                    style="display:none;"
                >
                    Remove
                </button>
            </div>
        `);

    imageField.on("change", function () {
      const file = this.files[0];

      if (!file) {
        return;
      }

      const reader = new FileReader();

      reader.onload = function (e) {
        $("#image-preview").attr("src", e.target.result).show();

        $("#remove-image").show();
      };

      reader.readAsDataURL(file);
    });

    $("#remove-image").on("click", function () {
      imageField.val("");

      $("#image-preview").attr("src", "").hide();

      $(this).hide();
    });
  });
})(django.jQuery);

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".variant-toggle-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const id = this.dataset.id;

      const wrapper = document.getElementById(`variant-wrapper-${id}`);

      if (!wrapper) return;

      const isOpen = wrapper.style.display === "block";

      wrapper.style.display = isOpen ? "none" : "block";

      this.textContent = isOpen ? "+" : "-";

      this.style.background = isOpen ? "#417690" : "#ba2121";
    });
  });
});
