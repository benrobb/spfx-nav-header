import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderName,
  PlaceholderContent
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';
import { escape } from '@microsoft/sp-lodash-subset';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as strings from 'ReactHeaderApplicationCustomizerStrings';
import { IReactHeaderProps } from './components/IReactHeaderProps';
import ReactHeader from './components/ReactHeader';

const LOG_SOURCE: string = 'ReactHeaderApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IReactHeaderApplicationCustomizerProperties {
  // This provides the URL for the list that drives the top nav.
  // TODO: set this via properties.
  GlobalNavListName: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class ReactHeaderApplicationCustomizer
  extends BaseApplicationCustomizer<IReactHeaderApplicationCustomizerProperties> {

  private _topPlaceholder : PlaceholderContent | undefined ;

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    // Added to handle possible changes on the existence of placeholders.
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
    
    // Call render method for generating the HTML elements.
    this._renderPlaceHolders();

    return Promise.resolve();
  }

  private _renderPlaceHolders(): void {

    console.log('HelloWorldApplicationCustomizer._renderPlaceHolders()');
    console.log('Available placeholders: ',
  this.context.placeholderProvider.placeholderNames.map(name => PlaceholderName[name]).join(', '));

    // Handling the top placeholder
    if (!this._topPlaceholder) {
  this._topPlaceholder =
    this.context.placeholderProvider.tryCreateContent(
      PlaceholderName.Top,
      { onDispose: this._onDispose });

  // The extension should not assume that the expected placeholder is available.
  if (!this._topPlaceholder) {
    console.error('The expected placeholder (Top) was not found.');
    return;
  }

  if (this.properties) {
    
    if (this._topPlaceholder.domElement) {
      const element: React.ReactElement<IReactHeaderProps> = React.createElement(
        ReactHeader,
        {
          listName: this.properties.GlobalNavListName,
          spHttpClient: this.context.spHttpClient,
          siteUrl: this.context.pageContext.web.serverRelativeUrl
        }
      );
      ReactDom.render(element, this._topPlaceholder.domElement);
    }
  }
    }

    
  }

  private _onDispose(): void {
    console.log('[ReactHeaderApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
  }
}
