import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StoreState } from 'src/types';
import 'rc-time-picker/assets/index.css';
import { changeUserSettings } from 'src/actions';
import * as moment from 'moment';
import { defaultLoad } from 'src/util/util';

const Loading = () => {
    return <div>Loading...</div>
}

const TimePicker: any = defaultLoad(() => import('../components/proxy/TimePicker'), Loading)

interface Props {
    showSettings: boolean;
    dispatch: Dispatch<Action<any>>;
    notificationTime: moment.Moment;
    mail: boolean;
}

function SettingsF({ dispatch, notificationTime, mail }: Props) {
    return (
        <div className="container mt-2">
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <div className="input-group-text">Daily reminder at</div>
                </div>
                <TimePicker onChange={(x: any) => dispatch(changeUserSettings(x, mail))}
                    showSecond={false} minuteStep={10} className="form-control"
                    value={notificationTime} />
                <div className="custom-control custom-checkbox my-1 mr-sm-2"
                    style={{ 'margin': '0px 5px 0px 5px' }}>
                    <input type="checkbox" className="custom-control-input" id="customControlInline"
                        checked={mail} onChange={x => dispatch(changeUserSettings(notificationTime, x.target.checked))} />
                    <label className="custom-control-label" htmlFor="customControlInline">Email</label>
                </div>
            </div>
        </div>
    );
}

let Settings = connect((state: StoreState) => {
    return {
        showSettings: state.ui.showSettings,
        notificationTime: state.ui.userSettings.notificationTime,
        mail: state.ui.userSettings.mail
    }
}, (dispatch: Dispatch<Action<any>>) => {
    return {
        dispatch
    }
})(SettingsF);

export default Settings;