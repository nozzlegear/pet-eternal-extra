declare var require: (package: string) => void;

require("./index.scss");

{
    const storageKey = ".PetEternal.HasClosedOfferBanner"; 
    const bannerContainer = document.getElementById("cta-top-banner-container");
    const banner = document.getElementById("cta-top-banner");
    const hasClosed = JSON.parse(localStorage.getItem(storageKey) || false.toString()) as boolean;
    
    if (!hasClosed && bannerContainer && banner)
    {
        const height = `${banner.clientHeight}px`;
        
        document.body.style.paddingBottom = height;
        bannerContainer.style.visibility = "visible";
        bannerContainer.style.height = height;
        
        const closeBanner = () =>
        {
            bannerContainer.style.height = "0";
            bannerContainer.style.visibility = "hidden";            
            document.body.style.paddingBottom = "0";
        }
        
        //Wire up event handlers
        const closeLink = document.getElementById("cta-top-banner-close");
        closeLink.addEventListener("click", (e) =>
        {
            e.preventDefault();
            
            localStorage.setItem(storageKey, true.toString());
            closeBanner();
        })
        
        const clickLink = document.getElementById("cta-top-banner-link");
        clickLink.addEventListener("click", (e) =>
        {
            e.preventDefault();
            
            localStorage.setItem(storageKey, true.toString());
            closeBanner();
            
            window.location.href = (e.target as HTMLAnchorElement).href;
        });
    }
}