import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterLikedLinesPipe } from './likeLinesFilter';
import { LinesByTextFilterPipe } from './linesByTextFilter';
import { FilterLinesByLinePipe } from './linesByLineFilter';
import { FilterOnlineLinesByStaticLinesPipe } from './onlineLinesByStaticLinesFilter';
import { GetFreqTimePipe } from './getFreqTime';
import { TimesFromNowFilterPipe } from './timesFromNowFilter';
import { FilterStationsAfterPipe } from './stationsAfterFilter';
import { FindLineByOrderPipe } from './lineByOrderFilter';
import { AboutFilterPipe } from './aboutFilter';
import { FilterLinesByClusterPipe } from './clusterLinesFilter';
import { SafeUrlPipe } from './safeUrl';


@NgModule({
  imports: [
    // CommonModule
  ],
  exports: [
    SafeUrlPipe,
    FilterLikedLinesPipe,
    LinesByTextFilterPipe,
    FilterLinesByLinePipe,
    FilterOnlineLinesByStaticLinesPipe,
    GetFreqTimePipe,
    TimesFromNowFilterPipe,
    FilterStationsAfterPipe,
    FindLineByOrderPipe,
    AboutFilterPipe,
    FilterLinesByClusterPipe
  ],
  declarations: [	
    SafeUrlPipe,
    FilterLikedLinesPipe,
    LinesByTextFilterPipe,
    FilterLinesByLinePipe,
    FilterOnlineLinesByStaticLinesPipe,
    GetFreqTimePipe,
    TimesFromNowFilterPipe,
    FilterStationsAfterPipe,
    FindLineByOrderPipe,
    AboutFilterPipe,
    FilterLinesByClusterPipe
   ]
})
export class PipeModule { }