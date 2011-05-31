var skills = [];
var currentSkills = [];
var companies = [];
var fillerFunctions = [];

var currJob;
var currSchool;
var currAff;
var currPub;

$(function() {
    var experienceTemplate = "<fieldset>" + $("#experience").html() + "</fieldset>";
    var schoolTemplate = "<fieldset>" + $("#school").html() + "</fieldset>";
    var pubTemplate = "<fieldset>" + $("#publication").html() + "</fieldset>";
    var affTemplate = "<fieldset>" + $("#affiliation").html() + "</fieldset>";
    currJob = $("#numJobs").val();
    currSchool = $("#numSchools").val();
    currAff = $("#numAffiliations").val();
    currPub = $("#numPublications").val();

    $.get('/skills/all', function(data) {

        $.each(data, function(index, value) {
            skills.push(value.name);
        });

        $.get('/skills/current', function(data) {
            $.each(data, function(index, value) {
                currentSkills.push(value.name);
            });

            //This might look weird but I don't fill the skills until
            //both current and all skills have been loaded
            $("#skills").tagit({
                availableTags: skills,
                startingTags: currentSkills,
                name: 'skills[]'
            });

        });

    });

    $.get('/companies/all', function(data) {
        $.each(data, function(index, value) {
            companies.push(value.name);
        });
        $(".companies").autocomplete({
            source: companies
        });
    });

    var addJobFunc = function(title, company, summary, startDate, endDate, remove) {
        title   = typeof(title) == 'string' ? title : '';
        company = typeof(company) == 'string' ? company : '';
        summary = typeof(summary) == 'string' ? summary: '';
        startDate = typeof(startDate) == 'string' ? startDate : '';
        endDate = typeof(endDate) == 'string' ? endDate : '';

        var newExp = experienceTemplate.replace(/1/g, ++currJob)
                                       .replace("#title#", title)
                                       .replace("#company#", company)
                                       .replace("#summary#", summary)
                                       .replace("#startDate#", startDate)
                                       .replace("#endDate#", endDate);
        var addJob = $("#addJob");

        $("#numJobs").val(currJob);

        addJob.parent().after(newExp);
        if(remove) {
            addJob.parent().remove();
        } else {
            addJob.remove();
        }

        $("#expStartDate" + currJob).datepicker();
        $("#expEndDate" + currJob).datepicker();
        $(".companies").autocomplete({
            source: companies
        });

        $("#title" + currJob + ", #company" + currJob).keyup(function() {
            var val1 = $("#title" + currJob).val();
            var val2 = $("#company" + currJob).val();

            if(val1 && val2) {
                if(!$("#expStartDate" + currJob).hasClass('required')) {
                    $("#expStartDate" + currJob).addClass('required');
                }
            } else {
                $("#expStartDate" + currJob).removeClass('required');
            }

        });


        $("#addJob.submit").click(addJobFunc);
    };

    var addSchoolFunc = function(summary, loc, startDate, endDate, remove) {
        summary = typeof(summary) == 'string' ? summary: '';
        loc = typeof(loc) == 'string' ? loc : '';
        startDate = typeof(startDate) == 'string' ? startDate : '';
        endDate = typeof(endDate) == 'string' ? endDate : '';

        var newSchool = schoolTemplate.replace(/1/g, ++currSchool)
                                      .replace("#summary#", summary)
                                      .replace("#location#", loc)
                                      .replace("#startDate#", startDate)
                                      .replace("#endDate#", endDate);
        var addSchool = $("#addSchool");

        $("#numSchools").val(currSchool);

        addSchool.parent().after(newSchool);
        if(remove) {
            addSchool.parent().remove();
        } else {
            addSchool.remove();
        }

        $("#addSchool.submit").click(addSchoolFunc);

        $("#degree" + currSchool).keyup(function() {
            var val1 = $("#degree" + currSchool).val();

            if(val1) {
                if(!$("#edStartDate" + currSchool).hasClass('required')) {
                    $("#edStartDate" + currSchool).addClass('required');
                }
            } else {
                $("#edStartDate" + currSchool).removeClass('required');
            }

        });

        $("#edStartDate" + currSchool).datepicker();
        $("#edEndDate" + currSchool).datepicker();
    };

    var addAffiliationFunc = function() {
        var newAff = affTemplate.replace(/1/g, ++currAff);
        var addAff = $("#addAffiliation");

        $("#numAffiliations").val(currAff);

        addAff.parent().after(newAff);
        addAff.remove();

        $("#addAffiliation.submit").click(addAffiliationFunc);
    };

    var addPublicationFunc = function(name, link) {
        name = typeof(name) == 'string' ? name : '';
        link = typeof(link) == 'string' ? link : '';

        var newPub = pubTemplate.replace(/1/g, ++currPub).
                                 replace("#name#", name).
                                 replace("#url#", link);
        var addPub = $("#addPublication");


        $("#numPublications").val(currPub);

        addPub.parent().after(newPub);
        addPub.remove();

        $("#addPublication.submit").click(addPublicationFunc);
    };

    $("#addJob.submit").click(addJobFunc);
    $("#addSchool.submit").click(addSchoolFunc);
    $("#addPublication.submit").click(addPublicationFunc);
    $("#addAffiliation.submit").click(addAffiliationFunc);

    $(".date").datepicker();

    $("#title1, #company1").keyup(function() {
        var val1 = $("#title1").val();
        var val2 = $("#company1").val();

        if(val1 && val2) {
            if(!$("#expStartDate1").hasClass('required')) {
                $("#expStartDate1").addClass('required');
            }
        } else {
            $("#expStartDate1").removeClass('required');
        }

    });

    $("#degree1").keyup(function() {
        var val1 = $("#degree1").val();

        if(val1) {
            if(!$("#edStartDate1").hasClass('required')) {
                $("#edStartDate1").addClass('required');
            }
        } else {
            $("#edStartDate1").removeClass('required');
        }

    });

    fillerFunctions.job = addJobFunc;
    fillerFunctions.school = addSchoolFunc;
    fillerFunctions.publication = addPublicationFunc;
    fillerFunctions.affiliation = addAffiliationFunc;

    $("#editForm").validate();
});

function formatDate(date) {
    if(date !== undefined) {
        var result = "";
        if(date.month !== undefined) {
            result = date.month + "/1/";
        } else {
            result = "1/1/";
        }
        result += date.year;
        return result;
    } else {
        return "";
    }
}

function loadData() {
    IN.API.Profile("me")
          .fields(["headline","summary","mainAddress", "skills", "positions","publications", "educations", "associations"])
          .result(function(result) {
        profile = result.values[0];
        $("#title").val(profile.headline);
        $("#summary").val(profile.summary);
        $("#address").val(profile.mainAddress);
        if(profile.skills !== undefined && profile.skills.values !== undefined) {
            $.each(profile.skills.values, function(index, value) {
                $("#skills").tagit({ action: 'add', value: value.skill.name, name: "skills[]" });
            });
        }
        if(profile.positions !== undefined && profile.positions.values !== undefined) {
            currJob -= 1;
            $.each(profile.positions.values, function(index, position) {
                var remove = (index === 0);
                fillerFunctions.job(position.title,
                    position.company.name,
                    position.summary,
                    formatDate(position.startDate),
                    formatDate(position.endDate),
                    remove);
            });
            fillerFunctions.job("",
                "",
                "",
                "",
                "",
                false);
        }
        if(profile.educations !== undefined && profile.educations.values !== undefined) {
            currSchool -= 1;
            $.each(profile.educations.values, function(index, education) {
                var remove = (index === 0);
                fillerFunctions.school(education.fieldOfStudy,
                    education.schoolName,
                    formatDate(education.startDate),
                    formatDate(education.endDate),
                    remove);
            });
            fillerFunctions.school("",
                "",
                "",
                "",
                false);
        }
        if(profile.publications !== undefined && profile.publications.values !== undefined) {
            $.each(profile.publications.values, function(index, position) {
            });
        }
        if(profile.associations !== undefined && profile.associations.values !== undefined) {
            $.each(profile.associations.values, function(index, position) {
            });
        }
    });
}

