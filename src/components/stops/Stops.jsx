import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchingData, fetchingFailed, fetchingSuccess } from "../../actions";

const url = "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql";
const query = `{
  stop(id: "HSL:1020453") {
   name
   	stoptimesWithoutPatterns {
        serviceDay
        scheduledArrival
        headsign
        trip {
          route {
            shortName
            agency {
              name
            }
          }
          wheelchairAccessible
          bikesAllowed
        }
        
      } 
  }  
}`;

const options = {
  method: "POST",
  headers: {
    "content-type": "application/json",
  },
  body: JSON.stringify({
    query,
  }),
};

const Stops = (props) => {
  const { stops, fetchData, fetchFailed, fetchSuccess } = props;
  const { data, loading, error } = stops;

  useEffect(() => {
    fetchData();
    fetch(url, options)
      .then((res) => res.json())
      .then((data) => fetchSuccess(data))
      .catch((e) => fetchFailed(e.message));
  }, [fetchData, fetchFailed, fetchSuccess]); // See the hints? :)

  const getDataFailed = () => {
    console.log("error error");
    return <span>{error}</span>;
  };

  function secondsToHms(d) {
    d = Number(d);
    const h = Math.floor(d / 3600);
    const m = Math.floor(d % 3600 / 60);

    return h + ":" + m ; 
}

  const getDataSuccess = () => {
    console.log("success success");
    if (data && data.stoptimesWithoutPatterns) {
      return (
        <div>
          <table className="timetableTable">
            <thead>
			  <th>Number</th>
              <th>From</th>
              <th>To </th>
              <th>Arrival Time</th>
              <th>Bike transport allowed: </th>
              <th>Wheelchair accessibility: </th>
            </thead>
            {data.stoptimesWithoutPatterns.map((stopInfo, index) => (
              <tbody key={index}>
                <tr>
					<td>{stopInfo.trip.route.shortName}</td>
                  <td>{data.name}</td>
                  <td>{stopInfo.headsign}</td>
                  <td>
                    {secondsToHms(stopInfo.scheduledArrival)}
                  </td>
                  <td>
                    {stopInfo.trip.bikesAllowed === "NOT_ALLOWED"
                      ? "No"
                      : "Yes"}{" "}
                  </td>
                  <td>
                    {" "}
                    {stopInfo.trip.wheelchairAccessible === "POSSIBLE"
                      ? "Yes"
                      : "No"}
                  </td>
                </tr>
              </tbody>
            ))}{" "}
          </table>
        </div>
      );
    }
  };

  const loadData = () => {
    console.log("fetching data");
    if (loading) {
      console.log(loading);
      return <span>Loading ...</span>;
    }
    if (error) {
      console.log(error);
      return getDataFailed();
    }
    if (data) {
      console.log(data);
      return getDataSuccess();
    }
  };
  return (
    <div>
      <h2>
        <span role="img" aria-label="lucky">
          👍🍀🤞
        </span>
        Good Luck with HSL! Timetable from Rautatieasema:
        <span role="img" aria-label="lucky">
          🤞🍀👍
        </span>
      </h2>
      {loadData()}
    </div>
  );
};

Stops.protoTypes = {
  data: PropTypes.object,
  fetchData: PropTypes.func,
  fetchFailed: PropTypes.func,
  fetchSuccess: PropTypes.func,
};

function mapStateToProps(state) {
  const { stops } = state;
  return {
    stops,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchData: () => {
      console.log("mapDispatchToProps, fetchData");
      dispatch(fetchingData());
    },
    fetchFailed: (error) => {
      console.log("mapDispatchToProps, fetchFailed");
      dispatch(fetchingFailed(error));
    },
    fetchSuccess: (data) => {
      console.log("mapDispatchToProps, fetchSuccess");
      dispatch(fetchingSuccess(data));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Stops);
