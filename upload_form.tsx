import ApiClient from "./api";
import * as React from 'react';
import * as ImageBlobber from "image-blobber";

export interface IProps extends React.Props<any>
{
    apiKey: string;
}

export interface IState
{
    blob?: ImageBlobber.BlobDetails;

    uploading?: boolean;
}

export default class UploadForm extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
        
        this.configureState(props, false);

        this.Client = new ApiClient(props.apiKey);
    }
    
    public state: IState = {};

    private Filepicker: HTMLInputElement;

    private Client: ApiClient;
    
    //#region Utility functions
    
    private configureState(props: IProps, useSetState: boolean)
    {
        let state: IState = {}
        
        if (!useSetState)
        {
            this.state = state;
            
            return;
        }
        
        this.setState(state);
    }
    
    //#endregion

    //#region Event handlers

    private openFilepicker(e: React.MouseEvent<any>)
    {
        if (this.Filepicker && ! this.state.uploading)
        {
            this.Filepicker.click();
        }
    }

    private handleFileChange(e: React.FormEvent<HTMLInputElement>)
    {
        ImageBlobber.getFileBlobs(e.target)
            .then((files) => ImageBlobber.getBase64(files[0]))
            .then((blob) =>
            {
                this.setState({blob: blob});
            });
    }

    public upload()
    {
        this.setState({uploading: true});

        return this.Client.uploadBase64(this.state.blob.base64).finally(() => this.setState({uploading: false}));
    }

    //#endregion
    
    public componentDidMount()
    {
           
    }
    
    public componentDidUpdate()
    {
        
    }
    
    public componentWillReceiveProps(props: IProps)
    {
        this.configureState(props, true);
    }
    
    public render()
    {
        let img: JSX.Element;

        if (this.state.blob)
        {
            img = <img id="upload-form-preview" src={this.state.blob.base64} />
        }
        else
        {
            img = (
            <div>
                <i class="fa fa-file-image-o fa-5x color" />
                <p class="color strong">
                    {"Click to upload an image of your pet."}
                </p>
            </div>
            )
        }

        return (
            <div id="upload-form" className={this.state.uploading ? "uploading" : ""} onClick={(e) => this.openFilepicker(e)}>
                {img}
                <input id="upload-form-filepicker" type="file" accept="image/*" ref={(fp) => this.Filepicker = fp} onChange={(e) => this.handleFileChange(e)} />
            </div>
        );
    }
}