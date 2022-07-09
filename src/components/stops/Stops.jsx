import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { fetchingData, fetchingFailed, fetchingSuccess } from '../../actions';

/** =====================================================================
 *  Feel free to change anything you wish as well as using
 *  Classes instead of Functional Components.
 *
 *  More info on README.md file
 *  Doubts? <vinicius@choicely.com>
 *  ======================================================================= */
const url = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';
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
	method: 'POST',
	headers: {
		'content-type': 'application/json',
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
			.then((data) => console.log(data))
			.catch((e) => console.log(e.message));
	}, [fetchData, fetchFailed, fetchSuccess]); // See the hints? :)

	return (
		<div>
			<h2>
				<span role="img" aria-label="lucky">
					👍🍀🤞
				</span>
				Good Luck!
				<span role="img" aria-label="lucky">
					🤞🍀👍
				</span>
			</h2>
			{error && <span>{error}</span>}
			{loading && <span>Loading ...</span>}
			{data && data.stoptimesWithoutPatterns && (
				<div>
					<h3>{data.name}</h3>
					{data.stoptimesWithoutPatterns.map((stopInfo, index) => (
						<span key={index}>{stopInfo.headsign}</span>
					))}
				</div>
			)}
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
			dispatch(fetchingData());
		},
		fetchFailed: (error) => {
			dispatch(fetchingFailed(error));
		},
		fetchSuccess: (data) => {
			dispatch(fetchingSuccess(data));
		},
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Stops);
