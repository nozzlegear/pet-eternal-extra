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

    if (container)
    {
        // Render the upload form in the container
        Dom.render(<UploadForm />, container);
    }
}