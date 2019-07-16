import * as React from "react";
import * as Dom from "react-dom";
import UploadForm from "./upload_form";
// import { Banner } from "./coupon_banner";

declare var require: (package: string) => void;
require("./index.styl");
require("regenerator-runtime/runtime");

/**
 * # # #
 * All pages
 * # # #
 */
// {
//     // Localstorage cannot be used when testing in a local file. Skip rendering the banner which uses localStorage.
//     if (! /file:\/\/\//i.test(window.location.href))
//     {
//         //Make version info available to the browser
//         const petEternal = window["PetEternal"] || {};
//         petEternal.version = _VERSION;
//         window["PetEternal"] = petEternal;

//         //Create a container for the component and render it into the dom
//         const container = document.createElement("div");
//         document.body.appendChild(container);

//         Dom.render(<Banner url="/shop" />, container);
//     }
// }

/**
 * # # #
 * Cart page
 * # # #
 */
{
    const table = document.querySelector("table.shop_table.cart");

    if (table) {
        const rows = table.querySelectorAll("tr.cart_item");

        // Iterate over each row
        for (let i = 0; i < rows.length; i++) {
            const row = rows.item(i);
            const container = row.querySelector("td.product-uploaded-image");

            // Read the row's data
            const data: {
                options: { name: string; value: "Pet Name" | "full_image_link" | "thumb_image_link"; price: string }[];
            } = JSON.parse(row.querySelector("script.cart_item_data").innerHTML);

            // Find the product's full_image_link and create an image from it
            const filteredData = data.options.filter(opt => opt.name === "thumb_image_link");

            if (filteredData.length === 0 || !container) {
                continue;
            }

            const thumbLink = filteredData[0];
            const img = document.createElement("img");
            img.src = thumbLink.value;
            img.classList.add("img-responsive");

            // Append the image to the row
            container.appendChild(img);
        }
    }
}

/**
 * # # #
 * Product pages
 * # # #
 */
{
    const container = document.querySelector("[data-upload-form]");
    const form = document.querySelector("form[method=post].cart") as HTMLFormElement;
    const apiKey = document.getElementById("pet-eternal-api-key").innerHTML;

    if (container && form && apiKey) {
        let fullImageInput: HTMLInputElement;
        let thumbImageInput: HTMLInputElement;

        // Find the image inputs
        const inputs = form.querySelectorAll("input[type=text]");

        for (let i = 0; i < inputs.length; i++) {
            const input = inputs.item(i) as HTMLInputElement;

            if (input.name === "custom-options[full_image_link]") {
                fullImageInput = input;
            } else if (input.name === "custom-options[thumb_image_link]") {
                thumbImageInput = input;
            }
        }

        // Hide both of the inputs
        fullImageInput.type = "hidden";
        thumbImageInput.type = "hidden";

        const button = form.querySelector("button[type=submit]");
        const originalButtonHtml = button.innerHTML;
        let uploading = false;

        // Render the upload form in the container
        const uploadForm: UploadForm = Dom.render<UploadForm>(<UploadForm apiKey={apiKey} />, container) as any;

        // Add an event listener to the form to prevent pressing enter to submit and bypass image upload.
        // This event listener is not called when submit is called programatically (via form.submit()).
        form.addEventListener("submit", e => e.preventDefault());

        // Since we don't control the WooCommerce 'Add to Cart' button, wire up an event listener on it to
        // prevent adding to the cart before the user has uploaded an image.
        button.addEventListener("click", e => {
            e.preventDefault();

            if (uploading) {
                return;
            }

            uploading = true;
            button.innerHTML = "<i class='fa fa-spinner fa-spin marRight5'></i> Uploading image...";

            uploadForm
                .upload()
                .then(result => {
                    // Image's URL must be added to the form to be shown in WooCommerce's checkout.
                    fullImageInput.value = result.fullAzureUrl;
                    thumbImageInput.value = result.thumbnailAzureUrl;

                    form.submit();
                })
                .catch(e => {
                    if (e instanceof Error) {
                        console.error("Error uploading image to Pet Eternal API.", e);
                    } else {
                        const error: XMLHttpRequest = e;

                        console.error(
                            `API returned an error when uploading user image: ${error.status} ${error.statusText}`,
                            error.responseText
                        );
                    }

                    alert("Something went wrong and your image could not be uploaded. Please try again.");

                    uploading = false;
                    button.innerHTML = originalButtonHtml;
                });
        });
    }
}
