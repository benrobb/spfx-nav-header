import * as React from 'react';
import styles from './ReactHeader.module.scss';
import { IReactHeaderProps } from './IReactHeaderProps';
import { IReactHeaderState } from './IReactHeaderState';
import { INavItem } from './INavItem';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';


export default class ReactHeader extends React.Component<IReactHeaderProps, IReactHeaderState> {
    private listItemEntityTypeName: string = undefined;
  
    constructor(props: IReactHeaderProps, state: IReactHeaderState) {
      super(props);
  
      this.state = {
        status: 'Ready',
        items: []
      };

      this.readItems();
    }
  
    public render(): React.ReactElement<IReactHeaderProps> {
      
      return (
        <div className={styles.app}>
          <div className={styles.top + " ms-bgColor-themeDark ms-Grid"} >
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-lg4 ms-fontColor-white ms-font-xxl">
                <a href={this.props.siteUrl} className="ms-fontColor-white">ROH Intranet</a>
              </div>
              {this.state.items.map(function(item,key){                  
                return (
                  <div className="ms-Grid-col ms-fontColor-white ms-font-l ms-lg1"><a href={item.Url}>{item.Title}</a></div> 
                  ); 
              })}
            </div>
          </div>
        </div>
      );
    }
  
    private readItems(): void {
      this.setState({
        status: 'Loading all items...',
        items: []
      });
      this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.listName}')/items`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            'Accept': 'application/json;odata=nometadata',
            'odata-version': ''
          }
        })
        .then((response: SPHttpClientResponse): Promise<{ value: INavItem[] }> => {
          return response.json();
        })
        .then((response: { value: INavItem[] }): void => {
          this.setState({
            status: `Successfully loaded ${response.value.length} items`,
            items: response.value
          });
        }, (error: any): void => {
          this.setState({
            status: 'Loading all items failed with error: ' + error,
            items: []
          });
        });
    }
  
    
  }
  