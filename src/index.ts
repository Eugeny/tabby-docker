import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import TabbyCoreModule, { ProfileProvider, TabRecoveryProvider } from 'tabby-core'
import TabbyTerminalModule from 'tabby-terminal'

import { DockerTabComponent } from './components/dockerTab.component'
import { DockerProfileSettingsComponent } from './components/dockerProfileSettings.component'
import { DockerProfileProvider } from './profiles'
import { RecoveryProvider } from './recoveryProvider'

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TabbyCoreModule,
        TabbyTerminalModule,
        NgbModule,
    ],
    providers: [
        { provide: ProfileProvider, useClass: DockerProfileProvider, multi: true },
        { provide: TabRecoveryProvider, useClass: RecoveryProvider, multi: true },
    ],
    entryComponents: [
        DockerTabComponent,
        DockerProfileSettingsComponent,
    ],
    declarations: [
        DockerTabComponent,
        DockerProfileSettingsComponent,
    ],
})
export default class DockerModule { }
