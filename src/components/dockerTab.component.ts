/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, Injector } from '@angular/core'
import { first } from 'rxjs'
import { BaseTerminalTabComponent } from 'tabby-terminal'
import { DockerProfile } from '../profiles'
import { DockerSession } from '../session'

/** @hidden */
@Component({
    selector: 'docker-tab',
    template: BaseTerminalTabComponent.template,
    styles: BaseTerminalTabComponent.styles,
    animations: BaseTerminalTabComponent.animations,
})
export class DockerTabComponent extends BaseTerminalTabComponent {
    profile?: DockerProfile
    session: DockerSession|null = null

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor (
        injector: Injector,
    ) {
        super(injector)
    }

    ngOnInit () {
        this.logger = this.log.create('dockerTab')

        this.subscribeUntilDestroyed(this.hotkeys.hotkey$, hotkey => {
            if (!this.hasFocus) {
                return
            }
            switch (hotkey) {
                case 'home':
                    this.sendInput('\x1b[H')
                    break
                case 'end':
                    this.sendInput('\x1b[F')
                    break
            }
        })

        this.frontendReady$.pipe(first()).subscribe(() => {
            this.initializeSession()
        })

        super.ngOnInit()

        setImmediate(() => {
            this.setTitle(this.profile!.name)
        })
    }

    async initializeSession () {
        if (!this.profile) {
            this.logger.error('No profile info supplied')
            return
        }

        const session = new DockerSession(this.injector, this.profile)
        this.setSession(session, true)

        this.startSpinner('Connecting')

        try {
            await this.session!.start()
            this.stopSpinner()
        } catch (e) {
            this.stopSpinner()
            this.write(e.message + '\r\n')
            return
        }
        this.session!.resize(this.size.columns, this.size.rows)
    }

    async getRecoveryToken (): Promise<any> {
        return {
            type: 'app:docker-tab',
            profile: this.profile,
            savedState: this.frontend?.saveState(),
        }
    }
}
