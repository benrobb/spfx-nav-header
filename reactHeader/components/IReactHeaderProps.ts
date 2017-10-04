import { SPHttpClient } from '@microsoft/sp-http'

export interface IReactHeaderProps {
    listName: string;
    spHttpClient: SPHttpClient;
    siteUrl: string;
}