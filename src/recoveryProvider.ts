import { Injectable } from '@angular/core'
import { TabRecoveryProvider, NewTabParameters, RecoveryToken } from 'tabby-core'
import { DockerTabComponent } from './components/dockerTab.component'

/** @hidden */
@Injectable()
export class RecoveryProvider extends TabRecoveryProvider<DockerTabComponent> {
    async applicableTo (recoveryToken: RecoveryToken): Promise<boolean> {
        return recoveryToken.type === 'app:docker-tab'
    }

    async recover (recoveryToken: RecoveryToken): Promise<NewTabParameters<DockerTabComponent>> {
        return {
            type: DockerTabComponent,
            inputs: {
                profile: recoveryToken.profile,
                savedState: recoveryToken.savedState,
            },
        }
    }
}
