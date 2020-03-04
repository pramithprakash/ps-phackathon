import React from 'react';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';
import DashboardIcon from '@material-ui/icons/Dashboard';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';
import CachedIcon from '@material-ui/icons/Cached';

import './LeftNavigation.scss';

export default function MenuListComposition() {
	return (
		<div className='left-nav-wrapper'>
            <Tooltip title="Dashboard" placement="right">
                <Link href='/'>
                    <DashboardIcon style={{ fontSize: 40 }} />
                </Link>
            </Tooltip>

            <Tooltip title="Feed file process" placement="right">
                <Link href='/feed'>
                    <DynamicFeedIcon style={{ fontSize: 40 }} />
                </Link>
            </Tooltip>

            <Tooltip title="Health Check" placement="right">
                <Link href='/healthcheck'>
                    <CachedIcon style={{ fontSize: 40 }} />
                </Link>
            </Tooltip>
		</div>
	);
}
