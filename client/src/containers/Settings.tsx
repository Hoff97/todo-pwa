import * as React from 'react';
import { Action, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { StoreState, Sub } from 'src/types';
import 'rc-time-picker/assets/index.css';
import { changeUserSettings, removeDevice } from 'src/actions';
import moment from 'moment';
import { defaultLoad } from 'src/util/util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Loading = () => {
    return <div>Loading...</div>
}

const TimePicker: any = defaultLoad(() => import('../components/proxy/TimePicker'), Loading)

interface Props {
    showSettings: boolean;
    dispatch: Dispatch<Action<any>>;
    notificationTime: moment.Moment;
    mail: boolean;
    subs: Sub[];
}

const letterWidth = 30;
function cutOffUrl(url: string) {
    let slice = url.slice(0, (window.innerWidth - letterWidth * 3) / letterWidth);
    if (slice.length < url.length) {
        return slice + '...';
    } else {
        return slice;
    }
}

function formatTs(ts: string) {
    return moment(ts).format('HH:mm DD.MM.')
}

function SettingsF({ dispatch, notificationTime, mail, subs }: Props) {
    return (
        <div className="container mt-2">
            <h3>Settings</h3>
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
            <h3>Devices</h3>
            <div className="row">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Description</th>
                            <th scope="col">Last login</th>
                            <th scope="col">Endpoint</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            subs.map(sub => (
                                <tr key={sub.endpoint}>
                                    <td>{sub.deviceDescription}</td>
                                    <td>{formatTs(sub.timestamp)}</td>
                                    <td>{cutOffUrl(sub.endpoint)}</td>
                                    <td>
                                        <button onClick={() => dispatch(removeDevice(sub.id))} className="mr-2 float-right btn btn-danger btn-sm">
                                            <FontAwesomeIcon icon="trash" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

let Settings = connect((state: StoreState) => {
    return {
        showSettings: state.ui.showSettings,
        notificationTime: state.ui.userSettings.notificationTime,
        mail: state.ui.userSettings.mail,
        subs: state.ui.subscriptions
    }
}, (dispatch: Dispatch<Action<any>>) => {
    return {
        dispatch
    }
})(SettingsF);

export default Settings;