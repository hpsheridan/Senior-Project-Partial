/**
 * Created by Maurice Becnel on 4/15/2018
 */
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import permissions from '../../middleware/ensurePermissionLevel';
import connection from "../../../src/sqlInfo";
import { MySQLConnection } from '../../../config/MySQLConnection';
import {
    createDepartmentViewOfCourses,
    createSchedulerMenuViewOfCourses
} from "../../utilities/buildJSONfromNormalizedCourses";




;
const methods = require( '../../utilities/schdlrQueryPromises' );
const {
    publishedSchedulesPromise,
    updateSchdedulerStatePromise,
    currentVersionRevisionPromise,
    coursesStudentViewPromise,
    updateSchdedulerUnderReviewPromise,
    insertScheduleToPeopleSoftPromise,
    insertModifiedCourseBasePromise,
    insertModifiedCourseInstructorPromise,
    insertModifiedCourseComponentPromise,
    insertModifiedMeetingPatternPromise,
    insertScheduleUnderReviewPromise,
    insertScheduleStatePromise,
    insertVersionsPromise,
} = methods;

let router = new Router( { prefix: 'scheduler' } );
router.use( permissions( 3 ) );
router.use( bodyParser() );


router.get( '/', async ( ctx, next ) => {
    ctx.body = { hello: 'hi' };
} );

// route to grab schedules published to the enforcer 
router.get( '/publishedSchedules/:term/', async ( ctx, next ) => {
    const { term } = ctx.params;
    try {
        const publishedSchedules = await publishedSchedulesPromise( term );
        ctx.body = { departments: publishedSchedules };
    } catch ( err ) {
        console.log( err );
        ctx.status = 500;
        ctx.body = { error: err };
    }
} );

// route to return the newest version and revision of a department
router.get( '/:department/:term/', async ( ctx, next ) => {
    const { department, term } = ctx.params;
    try {
        const versions = await currentVersionRevisionPromise( department, term );
        let versionList = [];
        versions.forEach( ( version ) => {
            versionList.push( version.version );
        } );
        let newestVersion = Math.max.apply( null, versionList ) && versionList.length !== 0 ? Math.max.apply( null, versionList ) : 1;
        const data = await coursesStudentViewPromise( term, department, newestVersion );
        ctx.body = { data: { studentView: data } };
    } catch ( err ) {
        console.log( err );
        ctx.status = 500;
        ctx.body = { error: err };
    }
} );

router.get( '/:department/:term/departmentView', async ( ctx, next ) => {
    const { department, term } = ctx.params;
    try {
        const versions = await currentVersionRevisionPromise( department, term );
        let versionList = [];
        versions.forEach( ( version ) => {
            versionList.push( version.version );
        } );
        let newestVersion = Math.max.apply( null, versionList ) && versionList.length !== 0 ? Math.max.apply( null, versionList ) : 1;
        const data = await coursesStudentViewPromise( term, department, newestVersion );
        const departmentView = createDepartmentViewOfCourses( data );
        // const schedulerView = createSchedulerMenuViewOfCourses(departmentView);
        //console.log(departmentView);
        ctx.body = { data: { departmentView: departmentView } };
    } catch ( err ) {
        console.log( err );
        ctx.status = 500;
        ctx.body = { error: err };
    }
} );

// route to return the newest version and revision of a department
router.get( '/:department/:term/schedulerView', async ( ctx, next ) => {
    const { department, term } = ctx.params;
    try {
        const versions = await currentVersionRevisionPromise( department, term );
        let versionList = [];
        versions.forEach( ( version ) => {
            versionList.push( version.version );
        } );
        let newestVersion = Math.max.apply( null, versionList ) && versionList.length !== 0 ? Math.max.apply( null, versionList ) : 1;
        const data = await coursesStudentViewPromise( term, department, newestVersion );
        const departmentView = createDepartmentViewOfCourses( data );
        const schedulerView = createSchedulerMenuViewOfCourses( departmentView );
        //console.log(departmentView);
        ctx.body = { data: { schedulerView: schedulerView } };
    } catch ( err ) {
        console.log( err );
        ctx.status = 500;
        ctx.body = { error: err };
    }
} );

// route for releasing a schedule from the enforcer back to the schedule maker
router.get( '/release/:department/:term/:version/:revision/', async ( ctx, next ) => {
    const { department, term, version, revision } = ctx.params;
    try {
        // queries to update released_to_dept and released_to_schdlr feilds in two different tables
        const underReview = await updateSchdedulerUnderReviewPromise( department, term, version, revision );
        const SchedulState = await updateSchdedulerStatePromise( department, term, version, revision );
        ctx.body = {
            SchedulerUnderReviewUpdate: underReview,
            ScheduleStateUdpate: SchedulState,
        };
    } catch ( err ) {
        console.log( err );
        ctx.status = 500;
        ctx.body = { error: err };
    }
} );

// post route for when enforcer module publishes schedule to peopleSoft. Will update 
// schdlr_to_peoplesoft, schdlr_sch_under_review, and schdlr_schedule_state tables
// no request.body all data needed is in url params 
router.post( '/peopleSoft/:term/:department/:version/:revision/', async ( ctx, next ) => {
    const { department, term, version, revision } = ctx.params;
    try {
        await updateSchdedulerUnderReviewPromise( term, department, version, revision, true );
        await updateSchdedulerStatePromise( term, department, version, revision, true );
        await insertScheduleToPeopleSoftPromise( term, department, version, revision );
        ctx.body = {
            "Message": "Successful"
        };
    } catch ( err ) {
        console.log( err );
        ctx.status = 500;
        ctx.body = { error: err };
    }
} );
// for inserting into three tables; schdlr_versions, schdlr_schedule_state, and schdlr_sch_under_review
// is route is to be used when the schedule maker publishes to the enforcer. 
// These tables are for managing the state of the schedule
// THIS POST METHOD DOES NOT USE A request.body. it only requires the url params 
router.post( '/publishSchedule/:term/:department/:version/:revision', async ( ctx, next ) => {
    const { department, term, version, revision } = ctx.params;
    try {
        await insertVersionsPromise( term, department, version, revision );
        // currently pass minorChange as false by default
        await insertScheduleUnderReviewPromise( term, department, version, revision, false );
        // pass isVersionCreated arg false. isVersionCreated will only be true when enforcer publishes to PeopleSoft
        await insertScheduleStatePromise( term, department, version, revision, false, false );
        ctx.body = {
            "Message": "Successful"
        };
    } catch ( err ) {
        console.log( err );
        ctx.status = 500;
        ctx.body = { error: err };
    }
} );


// route for inserting an array of coursebase objects into our schdlr_course_base table 
// each course base object structure should be the result of the inverse scripts 
router.post( '/courseBases/', async ( ctx, next ) => {
    const cb = ctx.request.rawBody;
    try {
        const sqlConnection = new MySQLConnection();
        let courseBases = JSON.parse( cb );
        await Promise.all( courseBases.map( async base => insertModifiedCourseBasePromise( base, sqlConnection ) ) );
        sqlConnection.close();
        console.log( "Bases done" );
        ctx.body = {
            "Message": "Successful"
        };
    } catch ( err ) {
        console.log( err );
        ctx.status = 500;
        ctx.body = { error: err };
    }
} );

// route for inserting an array of course component objects into our schdlr_course_component table 
// each course base object structure should be the result of the inverse scripts 
router.post( '/courseComponents/', async ( ctx, next ) => {
    const cc = ctx.request.rawBody;
    try {
        const sqlConnection = new MySQLConnection();
        let courseComponents = JSON.parse( cc );
        await Promise.all( courseComponents.map( async base => insertModifiedCourseComponentPromise( base, sqlConnection ) ) );
        sqlConnection.close();
        ctx.body = {
            "Message": "Successful"
        };
    } catch ( err ) {
        console.log( err );
        ctx.status = 500;
        ctx.body = { error: err };
    }
} );

router.post( '/instructors', async ( ctx, next ) => {
    const ci = ctx.request.rawBody;
    try {
        const sqlConnection = new MySQLConnection();
        let instructors = JSON.parse( ci );
        await Promise.all( instructors.map( async base => insertModifiedCourseInstructorPromise( base, sqlConnection ) ) );
        sqlConnection.close();
        ctx.body = {
            "Message": "Successful"
        };
    } catch ( err ) {
        console.log( err );
        ctx.status = 500;
        ctx.body = { error: err };
    }
} );

router.post( '/meetingPatterns', async ( ctx, next ) => {
    const mp = ctx.request.rawBody;
    try {
        const sqlConnection = new MySQLConnection();
        let meetingPatterns = JSON.parse( mp );
        await Promise.all( meetingPatterns.map( async base => insertModifiedMeetingPatternPromise( base, sqlConnection ) ) );
        sqlConnection.close();
        ctx.body = {
            "Message": "Successful"
        };
    } catch ( err ) {
        console.log( err );
        ctx.status = 500;
        ctx.body = { error: err };
    }
} );

export default router;
