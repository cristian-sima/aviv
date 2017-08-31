// @flow

import type { State, Emit } from "types";

type OwnProps = {
  id: string;
  emit: Emit;
}

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import AdvicerSection from "./AdvicerSection";

import {
  getItem,
  getCurrentItemAdvice,
  getIsItemAdviced,
} from "reducers";

const
  mapStateToProps = (state : State, { id } : OwnProps) => ({
    responses : getItem(state, id).get("responses"),
    isAdviced : getIsItemAdviced(state, id),
    advice    : getCurrentItemAdvice(state, id),
  });

export default withRouter(connect(mapStateToProps)(AdvicerSection));
