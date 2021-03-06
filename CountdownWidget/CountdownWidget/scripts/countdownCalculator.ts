﻿/// <reference path="../typings/index.d.ts" />
/// <reference path="../typings/index.d.ts" />
//---------------------------------------------------------------------
// <copyright file="countdownCalculator.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF 
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>
//    This is part of the Countdown widget
//    from the ALM Rangers. This file contains the
//    code to calculate the countdown delta.
// </summary>
//---------------------------------------------------------------------

/// <reference path='../typings/index.d.ts' />

import moment = require("moment-timezone");
import System_Contracts = require("VSS/Common/Contracts/System");

export class CountdownCalculator {

    from: moment.Moment;
    to: moment.Moment;
    workingdays: System_Contracts.DayOfWeek[];

    constructor(from: moment.Moment, to: moment.Moment, workingdays: System_Contracts.DayOfWeek[] = []) {
        this.from = from;
        this.to = to;
        this.workingdays = workingdays;
    }

    public isValid(): boolean {
        return this.from.isBefore(this.to.format());
    }

    private getDayOfWeekNumber(day: any): number {
        switch (day) {
            case "sunday": return 0;
            case "monday": return 1;
            case "tuesday": return 2;
            case "wednesday": return 3;
            case "thursday": return 4;
            case "friday": return 5;
            case "saturday": return 6;
        }
    }

    private isWorkDay(day: number): boolean { 
        for (var i = 0; i < this.workingdays.length; i++) {
            var workingDay = this.getDayOfWeekNumber(this.workingdays[i]);
            if (workingDay == day)
                return true;
        }
        return false;
    }

    private countExcluded(): number {
        var days = this.to.diff(this.from, 'days');
        var excludedDays = 0;
        for (var i = 0; i <= days; i++) { 
            var weekday = this.from.clone().add(i, 'days').weekday() - 1;
            if (!this.isWorkDay(weekday)) {
                excludedDays++;
            }
        }
        return excludedDays;
    };

    public getDifference(): CountdownResult {
        if (!this.isValid()) {
            return new CountdownResult(0, Unit.Invalid);
        }

        var diff = (unit: Unit) => {
            return this.to.diff(this.from, Unit[unit].toLowerCase());
        }

        var numberOfExcludedDays = 0;
        if (this.workingdays.length > 0) {
            numberOfExcludedDays = this.countExcluded();
        }

        this.to.add(-numberOfExcludedDays, Unit[Unit.Days].toLowerCase());
        var numberOfDays = diff(Unit.Days);

        if (numberOfDays >= 1) {
            return new CountdownResult(numberOfDays, Unit.Days);
        }
        else {
            var numberOfHours = diff(Unit.Hours);

            if (numberOfHours >= 1) {
                return new CountdownResult(numberOfHours, Unit.Hours);
            }
            else {
                var numberOfMinutes = diff(Unit.Minutes);
                if (numberOfMinutes >= 1) {
                    return new CountdownResult(numberOfMinutes, Unit.Minutes);
                }
                else {
                    var numberOfSeconds = diff(Unit.Seconds);
                    return new CountdownResult(numberOfSeconds, Unit.Seconds);
                }
            }
        }
    }
}

export class CountdownResult {

    constructor(public value: number, public unit: Unit) {
    }

    public getDisplayString(): string {
        return Unit[this.unit].toLowerCase();
    }
}

export enum Unit { Years, Days, Hours, Minutes, Seconds, Invalid };