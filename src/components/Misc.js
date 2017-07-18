import React from 'react';
import TitleBar from "./TitleBar";
import ButtonNormal from "./ButtonNormal";

export default class Misc extends React.Component {
    render() {
        return (
            <div className="column">
                <div className="misc_row">
                    <form>
                        <input type="text" value="Hello Message!"/>
                        <input className="page_header_button button_white" type="submit" value="Show Message"/>
                    </form>
                </div>
                <div className="misc_row">
                    <form>
                        <input type="text" value="Print This!!!"/>
                        <input className="page_header_button button_white" type="submit" value="Print Text"/>
                    </form>
                </div>
                <div className="misc_row">
                    <form>
                        <input type="text" value="JANRZXDFT3JF"/>
                        <input className="page_header_button button_white" type="submit" value="Query Payment"/>
                    </form>
                </div>
                <div className="misc_row">
                    <button className="page_header_button button_white">Show Welcome Message</button>
                    <button className="page_header_button button_white">Show Thank You</button>
                </div>
                <div className="misc_row">
                    <button className="page_header_button button_white">Cancel</button>
                    <button className="page_header_button button_white">Open Cash Drawer</button>
                </div>
                <div className="misc_row">
                    <button className="page_header_button button_white">Closeout Orders</button>
                    <button className="page_header_button button_white">Print Image</button>
                </div>
                <div className="misc_row">
                    <button className="page_header_button button_white">Get Device Status (Resend)</button>
                    <button className="page_header_button button_white">Get Device Status</button>
                </div>
                <div className="misc_row">
                    <button className="page_header_button button_white">Read Card Data</button>
                    <button className="page_header_button button_red">Reset Device</button>
                </div>
                <div className="custom_activities">
                    <h3>Custom Activities</h3>
                    <div className="misc_row">
                        <div>Non-Blocking</div>
                        <div className="onoffswitch">
                            <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitch" checked/>
                            <label className="onoffswitch-label" for="myonoffswitch">
                                <span className="onoffswitch-inner"/>
                                <span className="onoffswitch-switch"/>
                            </label>
                        </div>
                    </div>
                    <select>
                        <option value="">BasicExample</option>
                        <option value="">BasicConverationalExample</option>
                        <option value="">WebViewExample</option>
                        <option value="">CarouselExample</option>
                        <option value="">RatingsExample</option>
                        <option value="">NFCExample</option>
                    </select>
                    <input type="text" value="{name:Bob}"/>
                    <input className="page_header_button button_white" type="submit" value="Start"/>
                </div>

                <div className="Transaction Settings">
                    <h3>Transaction Settings</h3>
                    <div className="misc_row">
                        <div>Manual</div>
                        <div className="onoffswitch">
                            <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitch" checked/>
                            <label className="onoffswitch-label" for="myonoffswitch">
                                <span className="onoffswitch-inner"/>
                                <span className="onoffswitch-switch"/>
                            </label>
                        </div>
                    </div>
                    <div className="misc_row">
                        <div>Swipe</div>
                        <div className="onoffswitch">
                            <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitch" checked/>
                            <label className="onoffswitch-label" for="myonoffswitch">
                                <span className="onoffswitch-inner"/>
                                <span className="onoffswitch-switch"/>
                            </label>
                        </div>
                    </div>
                    <div className="misc_row">
                        <div>Chip</div>
                        <div className="onoffswitch">
                            <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitch" checked/>
                            <label className="onoffswitch-label" for="myonoffswitch">
                                <span className="onoffswitch-inner"/>
                                <span className="onoffswitch-switch"/>
                            </label>
                        </div>
                    </div>
                    <div className="misc_row">
                        <div>Contactless</div>
                        <div className="onoffswitch">
                            <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitch" checked/>
                            <label className="onoffswitch-label" for="myonoffswitch">
                                <span className="onoffswitch-inner"/>
                                <span className="onoffswitch-switch"/>
                            </label>
                        </div>
                    </div>

                    <div className="misc_row">
                        <div>Force Offline Payment</div>
                        <form action="">
                            <input type="radio" name="" value="default"/> Default
                            <input type="radio" name="" value="yes"/> Yes
                            <input type="radio" name="" value="no"/> No
                        </form>
                    </div>

                    <div className="misc_row">
                        <div>Allow Offline Payments</div>
                        <form action="">
                            <input type="radio" name="" value="default"/> Default
                            <input type="radio" name="" value="yes"/> Yes
                            <input type="radio" name="" value="no"/> No
                        </form>
                    </div>

                    <div className="misc_row">
                        <div>Accept Offline w/o Prompt</div>
                        <form action="">
                            <input type="radio" name="" value="default"/> Default
                            <input type="radio" name="" value="yes"/> Yes
                            <input type="radio" name="" value="no"/> No
                        </form>
                    </div>

                    <div className="misc_row">
                        <div>Tip Mode</div>
                        <select>
                            <option value="">Default</option>
                            <option value="">Tip Provided</option>
                            <option value="">On Screen Before Payment</option>
                            <option value="">No Tip</option>
                        </select>
                    </div>

                    <div className="misc_row">
                        <div>Sale Tip Amount</div>
                        <input type="text"/>
                    </div>

                    <div className="misc_row">
                        <div>Signature Entry Location</div>
                        <select>
                            <option value="">Default</option>
                            <option value="">On Screen</option>
                            <option value="">On Paper</option>
                            <option value="">None</option>
                        </select>
                    </div>

                    <div className="misc_row">
                        <div>Signature Threshold</div>
                        <input type="text"/>
                    </div>

                    <div className="misc_row">
                        <div>Disable Duplicate Payment Checking</div>
                        <div className="onoffswitch">
                            <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitch" checked/>
                            <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                <span className="onoffswitch-inner"/>
                                <span className="onoffswitch-switch"/>
                            </label>
                        </div>
                    </div>

                    <div className="misc_row">
                        <div>Disable Device Receipt Options Screen</div>
                        <div className="onoffswitch">
                            <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitch" checked/>
                            <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                <span className="onoffswitch-inner"/>
                                <span className="onoffswitch-switch"/>
                            </label>
                        </div>
                    </div>

                    <div className="misc_row">
                        <div>Disable Device Printing</div>
                        <div className="onoffswitch">
                            <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitch" checked/>
                            <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                <span className="onoffswitch-inner"/>
                                <span className="onoffswitch-switch"/>
                            </label>
                        </div>
                    </div>

                    <div className="misc_row">
                        <div>Automatically Confirm Signature</div>
                        <div className="onoffswitch">
                            <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitch" checked/>
                            <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                <span className="onoffswitch-inner"/>
                                <span className="onoffswitch-switch"/>
                            </label>
                        </div>
                    </div>

                    <div className="misc_row">
                        <div>Automatically Confirm Payment Challenges</div>
                        <div className="onoffswitch">
                            <input type="checkbox" name="onoffswitch" className="onoffswitch-checkbox" id="myonoffswitch" checked/>
                            <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                <span className="onoffswitch-inner"/>
                                <span className="onoffswitch-switch"/>
                            </label>
                        </div>
                    </div>


                </div>
            </div>
        );
    }
}