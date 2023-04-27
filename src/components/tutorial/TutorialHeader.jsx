import React from 'react';
import styles from "./TutorialHeader.css";
import VM from 'scratch-vm';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';

class TutorialHeaderComponent extends React.Component {

    constructor (props) {
        super(props);
        bindAll(this, [
            "onDragUpdate"
        ]);
        this.state = {
            passed: false
        };
    };

    componentDidMount () {
        this.props.vm.addListener('PROJECT_CHANGED', this.onDragUpdate);
    }

    componentWillUnmount() {
        this.props.vm.removeListener('PROJECT_CHANGED', this.onDragUpdate);
    }

    onDragUpdate() {
        const blocks = {...this.props.vm.runtime.targets[1].blocks};

        //Identify blocks by their opcode provided by Scratch VM
        const flagBlockId = Object.keys(blocks._blocks).find(key => blocks._blocks[key].opcode === "event_whenflagclicked");
        const motionBlockId = Object.keys(blocks._blocks).find(key => blocks._blocks[key].opcode === "motion_turnright");

        //If one of the blocks is missing, dismiss
        if (!flagBlockId || !motionBlockId) {
            this.setState({ passed: false });
            return;
        }

        //If both blocks are connected, pass the test
        this.setState({ passed: blocks._blocks[motionBlockId].parent === flagBlockId });
    }

    render () {
        return (
            <div className={this.state.passed ? styles.passed : styles.pending}>
                {this.state.passed ? "Tutorial complete!" : "Drag an Event block and a Motion block, and connect them"}
            </div>
        );
    }
};

TutorialHeaderComponent.propTypes = {
    vm: PropTypes.instanceOf(VM)
};

export default TutorialHeaderComponent;