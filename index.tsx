import * as React from "react";
import * as Dom from "react-dom";
import UploadForm from "./upload_form";

declare var require: (package: string) => void;
declare var _VERSION: string;

require("./index.scss");

export interface IProps extends React.Props<any>
{
    url: string;
}

export interface IState
{
    open?: boolean;
}

export class Banner extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
        
        this.configureState(props, false);
    }
    
    public state: IState = {};
    
    //#region Utility functions

    private container: HTMLElement;

    private banner: HTMLElement;
    
    private configureState(props: IProps, useSetState: boolean)
    {
        let storageItem = localStorage.getItem(this.storageKey);
        let isOpen = !storageItem;

        let state: IState = {
            open: isOpen,
        }
        
        if (!useSetState)
        {
            this.state = state;
            
            return;
        }
        
        this.setState(state);
    }

    private get storageKey()
    {
        return ".PetEternal.HasClosedOfferBanner";
    }
    
    //#endregion

    //#region Event handlers
    
    private closeBanner(e: React.MouseEvent<HTMLAnchorElement>)
    {
        e.preventDefault();

        localStorage.setItem(this.storageKey, true.toString());

        this.setState({open: false});
    }

    private handleClick(e: React.MouseEvent<HTMLAnchorElement>)
    {
        this.closeBanner(e);

        window.location.href = this.props.url;
    }

    private configureHeight(container: HTMLElement)
    {
        this.container = container;

        if (!container)
        {
            return;
        }

        if (this.state.open)
        {
            container.style.height = this.banner.clientHeight + "px";
        }
        else
        {
            container.style.height = undefined;
        }
    }

    //#endregion
    
    public componentDidMount()
    {
           
    }
    
    public componentDidUpdate(newProps: IProps, newState: IState)
    {
        
    }
    
    public componentWillReceiveProps(props: IProps)
    {
        this.configureState(props, true);
    }
    
    public render()
    {
        return (
            <section id="cta-top-banner-container" ref={(r) => this.configureHeight(r)} className={this.state.open ? "open" : "closed"}>
                <div id="cta-top-banner" ref={(r) => this.banner = r}>
                    <h3>
                        <a href={this.props.url} id="cta-top-banner-link" onClick={(e) => this.handleClick(e)}>
                            {`Get 25% off any order by using the coupon code `}
                            <span className="underline">{"HAPPYPETS"}</span> 
                            {` at checkout!`}
                        </a>
                    </h3>
                    <a href="#" className="pull-right" id="cta-top-banner-close" onClick={(e) => this.closeBanner(e)}>
                        <i className="fa fa-close" />
                    </a>
                </div>
            </section>
        );
    }
}

{
    // Localstorage cannot be used when testing in a local file. Skip rendering the banner which uses localStorage.
    if (! /file:\/\/\//i.test(window.location.href))
    {
        //Make version info available to the browser
        const petEternal = window["PetEternal"] || {};
        petEternal.version = _VERSION;
        window["PetEternal"] = petEternal;

        //Create a container for the component and render it into the dom
        const container = document.createElement("div");
        document.body.appendChild(container);

        Dom.render(<Banner url="/shop" />, container);
    }
}

{
    const container = document.querySelector("[data-upload-form]");
    const form = document.querySelector("form[method=post].cart") as HTMLFormElement;
    const apiKey = document.getElementById("pet-eternal-api-key").innerHTML;
    let fullImageInput: HTMLInputElement;
    let thumbImageInput: HTMLInputElement;

    if (container && form && apiKey)
    {
        const button = form.querySelector("button[type=submit]");
        const originalButtonHtml = button.innerHTML;
        let uploading = false;

        // Create an input to record the image's final URL after upload.
        {
            fullImageInput = document.createElement("input");
            fullImageInput.type = "hidden";
            fullImageInput.name = "custom-options[full_image_link]";

            thumbImageInput = document.createElement("input");
            thumbImageInput.type = "hidden";
            thumbImageInput.name = "custom-options[thumb_image_link]";

            form.appendChild(fullImageInput);
            form.appendChild(thumbImageInput);
        }

        // Render the upload form in the container
        const uploadForm: UploadForm = Dom.render<UploadForm>(<UploadForm apiKey={apiKey} />, container) as any;

        // Add an event listener to the form to prevent pressing enter to submit and bypass image upload.
        // This event listener is not called when submit is called programatically (via form.submit()).
        form.addEventListener("submit", (e) => e.preventDefault());

        // Since we don't control the WooCommerce 'Add to Cart' button, wire up an event listener on it to 
        // prevent adding to the cart before the user has uploaded an image.
        button.addEventListener("click", (e) =>
        {
            e.preventDefault();

            if (uploading)
            {
                return;
            }

            uploading = true;
            button.innerHTML = "<i class='fa fa-spinner fa-spin marRight5'></i> Uploading image...";

            console.log("Beginning form upload.");

            uploadForm.upload().then((result) =>
            {
                // Image's URL must be added to the form to be shown in WooCommerce's checkout.
                fullImageInput.value = result.fullAzureUrl;
                thumbImageInput.value = result.thumbnailAzureUrl;
                
                form.submit();       
            }).catch((e) =>
            {
                if (e instanceof Error)
                {
                    console.error("Error uploading image to Pet Eternal API.", e);
                } 
                else
                {
                    const error: XMLHttpRequest = e;

                    console.error(`API returned an error when uploading user image: ${error.status} ${error.statusText}`, error.responseText);
                }

                alert("Something went wrong and your image could not be uploaded. Please try again.");

                uploading = false;
                button.innerHTML = originalButtonHtml;
            });
        })
    }
}