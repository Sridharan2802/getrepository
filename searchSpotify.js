import { LightningElement } from 'lwc';
import searchwithSpotify from '@salesforce/apex/SpotifyController.searchwithSpotify';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SearchSpotify extends LightningElement {


searchTracker;
displayResult=false;
trackData='';
trackUrl='';

    changeHandler(event)
    {
        this.searchTracker=event.target.value;

    }


    async searchTrack()
    {
        let isValid = this.validateInput();

        if(isValid)
        {
            try{

                let responseString = await searchwithSpotify({trackName:this.searchTracker})
                let response=JSON.parse(responseString);
                this.displayResult=true;
                this.trackData=response.tracks.items[0];
                this.trackUrl=this.trackData.album.images[0].url;


            }

            catch(error)
            {
                console.log(error);
                this.showToast('Error','Something went wrong','error');

            }

        }



    }

    validateInput()
    {
        let isValid = true;
        let element = this.template.querySelector('lightning-input');

        if(!element.checkValidity())
        {
            element.reportValidity();
            isValid = false;

        }
        return isValid;

    }

    showToast(title,message,variant) {
        const event = new ShowToastEvent({
            title: title,
            message:message,
            variant:variant
                
        });
        this.dispatchEvent(event);
    }

    get artistName()
    {
        let artistNameArr = this.trackData.artists.map(currItem => currItem.name);
        let artistNameString = artistNameArr.join(",");
        return artistNameString;


    }

}
