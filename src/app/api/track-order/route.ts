import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trackBy, searchValue } = body;

    if (!trackBy || !searchValue) {
      return NextResponse.json(
        { error: 'Missing required fields: trackBy and searchValue' },
        { status: 400 }
      );
    }

    const externalApiUrl =
      'https://07650.cxtsoftware.net/CxtWebService/CXTWCF.svc/v2/Shipments/Summaries';

    const endDate = new Date();
    const beginDate = new Date();

    beginDate.setMonth(beginDate.getMonth() - 2);

    const formattedEndDate = endDate.toISOString().split('T')[0];
    const formattedBeginDate = beginDate.toISOString().split('T')[0];

    const queryParams = new URLSearchParams({
      trackingType: 'TRACKING',
      beginDate: formattedBeginDate,
      endDate: formattedEndDate,
      pageNum: '1',
      pageSize: '12',
    });

    const fullUrl = `${externalApiUrl}?${queryParams.toString()}`;

    try {
      const externalResponse = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          CallingApplication: 'Rapidship',
          'sec-ch-ua-platform': 'Windows',
          Referer: 'https://07650.cxtsoftware.net/rapidship/',
          'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
          'sec-ch-ua-mobile': '?0',
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
        },
        body: JSON.stringify(searchValue),
      });

      if (!externalResponse.ok) {
        throw new Error(
          `External API error: ${externalResponse.status} ${externalResponse.statusText}`
        );
      }

      const externalData = await externalResponse.json();

      if (externalData.summaries && externalData.summaries.length > 0) {
        const firstShipment = externalData.summaries[0];
        const shipmentId = firstShipment.id;
        const shipmentType = firstShipment.type;

        try {
          const detailsUrl = `https://07650.cxtsoftware.net/CxtWebService/CXTWCF.svc/v2/Shipments/Details?shipmentType=${shipmentType}&pkId=${shipmentId}`;

          const detailsResponse = await fetch(detailsUrl, {
            method: 'GET',
            headers: {
              CallingApplication: 'Rapidship',
              'sec-ch-ua-platform': 'Windows',
              Referer: 'https://07650.cxtsoftware.net/rapidship/',
              'sec-ch-ua': '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
              'sec-ch-ua-mobile': '?0',
              Accept: 'application/json',
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
            },
          });

          if (!detailsResponse.ok) {
            throw new Error(
              `Details API error: ${detailsResponse.status} ${detailsResponse.statusText}`
            );
          }

          const detailsData = await detailsResponse.json();

          return NextResponse.json(
            {
              summaries: externalData.summaries,
              totalResults: externalData.totalResults,
              details: detailsData,
              shipmentInfo: {
                id: shipmentId,
                type: shipmentType,
              },
            },
            { status: 200 }
          );
        } catch (detailsError) {
          console.error('Error calling details API:', detailsError);
          return NextResponse.json(
            {
              summaries: externalData.summaries,
              totalResults: externalData.totalResults,
              detailsError: 'Failed to fetch shipment details',
              shipmentInfo: {
                id: shipmentId,
                type: shipmentType,
              },
            },
            { status: 200 }
          );
        }
      }

      return NextResponse.json(externalData, { status: 200 });
    } catch (externalError) {
      console.error('Error calling external API:', externalError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to call external tracking service',
          details: externalError.message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in track-order API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
