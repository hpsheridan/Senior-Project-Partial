// this function processes the json to reflect the parent-child relationship
// needed to draw the tree
// Created 10/01/2019

function Pre_ProcessJSON(json){

    //this is the format that the json needs to reflect
    let fullObj = {
        name: "",
        children: [],
        is_updated: false
    };

    let headers = [];
    fullObj.name = 'departmentView'; //this can be changed to reflect the Major that was clicked on

    let i = 0;
    let jsn = json['departmentView'];
    if(!jsn){
        jsn = json;
    }

    let keys = Object.keys(jsn);

    //for adding classes
    if(keys[0] === '0'){
        let tmpkey = {};
        for(let i = 0; i < keys.length; i ++){
            let k = Object.keys(jsn[keys[i]]);
            tmpkey[k[0]] = jsn[keys[i]][k[0]];
        }
      keys = Object.keys(tmpkey);
      jsn = tmpkey;
    }


    keys.forEach((combined_class) => {
        let titleObj = {
            name : "",
            children: [],
            is_updated : false,
            isMultiComponent : false,
            info: []
        };

        //title is in the format CS-101
        let title = combined_class.substr(0, combined_class.indexOf(' '));
        titleObj.name = title;


        //combined_classObj is in the format CS-101 2187 1002
        let combined_classObj = {
            name : "",
            children: [],
            is_updated : false
        };
        combined_classObj.name = combined_class;


        //generate intermediate level with the course_title
        jsn[combined_class].forEach((section) =>{
            //console.log("jsn[combined_class]", jsn[combined_class], section);

            let sectionObj = {
                name: section.course_title,
                children: [],
                is_updated: false,
                combined_class_number : section.combined_class_number,
                inf: section
            };

            //generate children
            // leaf node is the component (LAB/LEC/DIS...) and the instructor name
            if(section.components){
                section.components.forEach((comp) =>{

                    let instructorName = section[comp].instructors;
                    instructorName.forEach((instructor) => {
                        instructorName = instructor.instructor_fName + " " + instructor.instructor_lName ;
                    });

                    let compObj = {
                        name: "",
                        children: [],
                        is_updated : false,
                        class_number: section[comp].class_number,
                        combined_class_number: section.combined_class_number
                    };

                    compObj.name = comp + ": " + instructorName;
                    sectionObj.children.push(compObj);
                })
            }

            combined_classObj.children.push(sectionObj);
        });


        if(i === 0){
            titleObj.children.push(combined_classObj);
            let tmpObj = {};
            /* eslint-disable no-eval */
            tmpObj[eval("combined_class")] = jsn[combined_class];
            titleObj.info.push(tmpObj);
            headers.push(titleObj);
            i++;
        }
        else if(headers[i- 1].name !== title){
            titleObj.children.push(combined_classObj);
            let tmpObj = {};
            tmpObj[eval("combined_class")] = jsn[combined_class];
            titleObj.info.push(tmpObj);

            headers.push(titleObj);
            i++;
        }
        else{
            headers[i- 1].children.push(combined_classObj);
            headers[i-1].isMultiComponent = true;
            let tmpObj = {};
            tmpObj[eval("combined_class")] = jsn[combined_class];
            headers[i-1].info.push(tmpObj);
        }

    });

    //sort headers
    headers.sort(function (a, b) {
        let aName = a.name.substring(3, 6);
        let bName = b.name.substring(3, 6);

        if (aName < bName) {
            return -1;
        } else if (aName > bName) {
            return 1;
        } else {
            return 0;
        }
    });

    fullObj.children = headers;
    //console.log("fullObj: ", fullObj);

    //pre-processing done
    return fullObj;
}

export {Pre_ProcessJSON}
