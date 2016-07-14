import * as React from "react";
import * as Dom from "react-dom";

declare var require: (package: string) => void;

require("./index.scss");

export interface IProps extends React.Props<any>
{
    
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
        let state: IState = {
            open: !JSON.parse(localStorage.getItem(this.storageKey)),
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

        window.location.href = e.target.href;
    }

    private configureHeight(container: HTMLElement)
    {
        this.container = container;

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
        const hasClosed = JSON.parse(localStorage.getItem(this.storageKey) || false.toString()) as boolean;

        return (
            <section id="cta-top-banner-container" ref={(r) => this.configureHeight(r)} className={this.state.open ? "open" : "closed"}>
                <div id="cta-top-banner" ref={(r) => this.banner = r}>
                    <h3>
                        <a href="/shop" id="cta-top-banner-link" onClick={(e) => this.handleClick(e)}>
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
    const container = document.createElement("div");
    document.body.appendChild(container);

    Dom.render(<Banner />, container);
}